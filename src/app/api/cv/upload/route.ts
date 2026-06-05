import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deductToken, getTokenInfo } from "@/lib/tokens";
import { uploadToImageKit } from "@/lib/imagekit";
import { saveScan } from "@/lib/scan-storage";
import { geminiChat } from "@/lib/gemini";
import { GEMINI_MODEL_SCORING } from "@/lib/constants";
import { PDF_CV_ANALYSIS_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { PDFAnalysisResult, AIScoreBreakdown } from "@/lib/schemas";

function extractJSON(raw: string): string {
  const cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

/**
 * Fallback parser that extracts score, breakdown, impressions, etc.
 * from a markdown / plain-text AI response when JSON parsing fails.
 */
function parseFallbackAnalysis(raw: string): PDFAnalysisResult {
  const scoreMatch = raw.match(/(?:\*\*)?\s*[Ss]core\s*:?\s*(\d{1,3})/);
  const score = scoreMatch ? Math.min(100, Math.max(1, parseInt(scoreMatch[1]))) : 50;

  const extractBreakdownValue = (label: string): number => {
    const re = new RegExp(`\\*?\\*?${label}\\s*:?\\s*(\\d{1,3})`, "i");
    const m = raw.match(re);
    return m ? Math.min(100, Math.max(0, parseInt(m[1]))) : 50;
  };

  const breakdown: AIScoreBreakdown = {
    ats: extractBreakdownValue("ATS"),
    impact: extractBreakdownValue("Impact"),
    formatting: extractBreakdownValue("Formatting"),
    keywords: extractBreakdownValue("Keywords"),
    tone: extractBreakdownValue("Tone"),
  };

  // Extract sections by heading
  const extractListItems = (heading: string): string[] => {
    const sectionRegex = new RegExp(
      `\\*?\\*?${heading}\\s*:?[\\s\\S]*?(?=\\n\\s*\\*?\\*?\\w+(?:\\s+\\w+)*\\s*:|$)`,
      "im"
    );
    const section = raw.match(sectionRegex);
    if (!section) return [];
    const items = [...section[0].matchAll(/[-*]\s*(.+?)(?=\n|$)/g)]
      .map((m) => m[1].trim())
      .filter((t) => t.length > 3);
    return items;
  };

  // Collect detailed overview
  const overviewMatch = raw.match(
    /(?:\*\*)?Overview(?:\*\*)?\s*:?([\s\S]*?)(?=\n\s*(?:\*\*)?(?:Good|Bad|Strengths|Weaknesses))/i
  );

  const detailedOverview = overviewMatch
    ? overviewMatch[1].trim()
    : "AI analysis completed. Review the sections below for detailed feedback.";

  const goodImpressions = extractListItems("Good Impressions?");
  const badImpressions = extractListItems("Bad Impressions?");
  const actionItems = extractListItems("Action Items?");
  const weaknesses = extractListItems("Weaknesses?");
  const tipsToFix = extractListItems("Tips?|Tips to Fix");

  const fallbackBad = badImpressions.length ? badImpressions : ["Review the AI feedback"];
  const fallbackActions = actionItems.length ? actionItems : ["Review your CV based on the analysis"];

  return {
    score,
    breakdown,
    detailedOverview,
    goodImpressions: goodImpressions.length ? goodImpressions : ["CV analysis completed"],
    badImpressions: fallbackBad,
    actionItems: fallbackActions,
    weaknesses: weaknesses.length ? weaknesses : fallbackBad,
    tipsToFix: tipsToFix.length ? tipsToFix : fallbackActions,
  };
}

async function parsePDF(buffer: Buffer): Promise<string> {
  const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const data = await pdf(buffer);
  return data.text;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Daily usage check (10 scans per day)
    const today = new Date().toISOString().slice(0, 10);
    let usage = await prisma.dailyUsage.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });
    if (!usage) {
      usage = await prisma.dailyUsage.create({
        data: { userId: user.id, date: today, checksCount: 0, generationsCount: 0 },
      });
    }
    if (usage.checksCount >= 10) {
      return NextResponse.json(
        { error: "Daily scan limit reached (10 scans per day). Upgrade or try again tomorrow." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const tokenInfo = await getTokenInfo(user.id);
    if (!tokenInfo || tokenInfo.balance <= 0) {
      return NextResponse.json(
        { error: "Insufficient tokens. You get 50 free tokens per week." },
        { status: 403 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await parsePDF(buffer);

    if (!text || text.length < 20) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from this PDF. Ensure it is not a scanned image." },
        { status: 400 }
      );
    }

    const imageKitUrl = await uploadToImageKit(buffer, file.name);

    const raw = await geminiChat({
      model: GEMINI_MODEL_SCORING,
      systemInstruction: PDF_CV_ANALYSIS_SYSTEM_PROMPT,
      contents: [
        {
          role: "user",
          parts: [{ text: `CV PDF Text:\n\n${text.slice(0, 15000)}` }],
        },
      ],
      temperature: 0.3,
      maxTokens: 8192,
    });

    const cleaned = extractJSON(raw);
    let result: PDFAnalysisResult;

    try {
      result = JSON.parse(cleaned) as PDFAnalysisResult;
    } catch {
      // Fallback: try parsing as markdown / plain text
      console.warn("JSON parse failed in upload route, trying fallback parser");
      result = parseFallbackAnalysis(raw);
    }

    // Validate the parsed result has minimum required fields
    if (typeof result.score !== "number") {
      result.score = 50;
    }
    if (!result.breakdown || typeof result.breakdown !== "object") {
      result.breakdown = { ats: 50, impact: 50, formatting: 50, keywords: 50, tone: 50 };
    }
    // Ensure all breakdown sub-fields exist
    const bd = result.breakdown;
    result.breakdown = {
      ats: typeof bd.ats === "number" ? bd.ats : 50,
      impact: typeof bd.impact === "number" ? bd.impact : 50,
      formatting: typeof bd.formatting === "number" ? bd.formatting : 50,
      keywords: typeof bd.keywords === "number" ? bd.keywords : 50,
      tone: typeof bd.tone === "number" ? bd.tone : 50,
    };
    // Fall back badImpressions into weaknesses if empty
    if (!result.weaknesses || result.weaknesses.length === 0) {
      result.weaknesses = (result.badImpressions || []).filter(Boolean);
    }
    // Fall back actionItems into tipsToFix if empty
    if (!result.tipsToFix || result.tipsToFix.length === 0) {
      result.tipsToFix = (result.actionItems || []).filter(Boolean);
    }

    if (!(await deductToken(user.id))) {
      return NextResponse.json(
        { error: "Token deduction failed" },
        { status: 500 }
      );
    }

    const updatedTokenInfo = await getTokenInfo(user.id);

    const scan = await saveScan({
      userId: user.id,
      fileName: file.name,
      imageKitUrl: imageKitUrl ?? undefined,
      textSnippet: text.slice(0, 500),
      result: {
        score: result.score,
        breakdown: result.breakdown,
        goodImpressions: result.goodImpressions || [],
        badImpressions: result.badImpressions || [],
        actionItems: result.actionItems || [],
      },
      score: result.score,
    });

    await prisma.dailyUsage.update({
      where: { userId_date: { userId: user.id, date: today } },
      data: { checksCount: { increment: 1 } },
    });

    return NextResponse.json({
      scan,
      analysis: result,
      tokenBalance: updatedTokenInfo?.balance ?? 0,
    });
  } catch (error: any) {
    console.error("/api/cv/upload error:", error);
    const message = error.message?.includes("PDF")
      ? error.message
      : "Failed to process CV. Please ensure the PDF is valid and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
