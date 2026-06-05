import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import {
  GEMMA_SCORING_SYSTEM_PROMPT,
  cvToText,
} from "@/lib/ai-prompts";
import {
  checkRateLimit,
  incrementRateLimit,
} from "@/lib/rate-limit-server";
import { CVData, AICheckResult } from "@/lib/schemas";

function extractJSON(raw: string): string {
  const cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}

function parseMarkdownAnalysis(raw: string): AICheckResult {
  const scoreMatch = raw.match(/\*?\*?Score:?[\s\S]*?(\d{1,3})/i);
  const score = scoreMatch ? Math.min(100, Math.max(1, parseInt(scoreMatch[1]))) : 50;

  const extractSection = (heading: string): string[] => {
    const sectionRegex = new RegExp(
      `\\*?\\*?${heading}[:\\s]*(.*?)(?=\\n\\s*\\*?\\*?\\w+\\b.*:|$)`,
      "ims"
    );
    const section = raw.match(sectionRegex);
    if (!section) return [];

    return [...section[1].matchAll(/\*?\s*\*?\s*(.+?)(?=\n\s*(?:\*|$)|$)/g)]
      .map((m) => m[1].trim())
      .filter((t) => t.length > 5 && !t.match(/^(score|breakdown|input|goal|role|content)/i));
  };

  const extractBreakdownValue = (label: string): number => {
    const re = new RegExp(`\\*?\\*?${label}:\\s*(\\d{1,3})`, "i");
    const m = raw.match(re);
    return m ? Math.min(100, Math.max(0, parseInt(m[1]))) : 50;
  };

  const extractHeadingItems = (heading: string): string[] => {
    const sectionRegex = new RegExp(
      `\\*?\\*?${heading}[:\\s]*(.*?)(?=\\n\\s*\\*?\\*?(?:\\w+\\b.*):|$)`,
      "ims"
    );
    const section = raw.match(sectionRegex);
    if (!section) return [];

    return [...section[1].matchAll(/\*?\s*(.+?)(?=\n\s*(?:\*|$)|$)/g)]
      .map((m) => m[1].trim())
      .filter((t) => t.length > 3 && !t.startsWith("*"));
  };

  const good = extractHeadingItems("Good Impressions?");
  const bad = extractHeadingItems("Bad Impressions?");
  const action = extractHeadingItems("Action Items?");

  return {
    score,
    breakdown: {
      ats: extractBreakdownValue("ATS"),
      impact: extractBreakdownValue("Impact"),
      formatting: extractBreakdownValue("Formatting"),
      keywords: extractBreakdownValue("Keywords"),
      tone: extractBreakdownValue("Tone"),
    },
    goodImpressions: good.length ? good : ["CV analysis completed"],
    badImpressions: bad.length ? bad : ["Review the AI feedback for improvements"],
    actionItems: action.length
      ? action
      : extractSection("Action").length
      ? extractSection("Action")
      : ["Review and enhance your CV based on the analysis"],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { email, cvData } = (await request.json()) as {
      email: string;
      cvData: CVData;
    };

    if (!email || !cvData) {
      return NextResponse.json(
        { error: "email and cvData are required" },
        { status: 400 }
      );
    }

    const { allowed } = await checkRateLimit(email, "check");
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded. You can perform 10 checks per day.",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const cvText = cvToText(cvData);

    const raw = await geminiChat({
      systemInstruction: GEMMA_SCORING_SYSTEM_PROMPT,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CV Data:\n\n${cvText}`,
            },
          ],
        },
      ],
      temperature: 0.3,
      maxTokens: 4096,
    });

    const cleaned = extractJSON(raw);

    let result: AICheckResult;

    // Strategy 1: Parse as JSON
    try {
      result = JSON.parse(cleaned) as AICheckResult;
    } catch {
      // Strategy 2: Parse markdown analysis as fallback
      console.warn("JSON parse failed, falling back to markdown parser");
      result = parseMarkdownAnalysis(raw);
    }

    await incrementRateLimit(email, "check");

    const { remaining } = await checkRateLimit(email, "check");

    return NextResponse.json({
      result,
      remaining,
    });
  } catch (error: any) {
    console.error("/api/ai/check error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
