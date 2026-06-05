import { NextRequest, NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { LLAMA_TEMPLATE_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import {
  checkRateLimit,
  incrementRateLimit,
} from "@/lib/rate-limit-server";
import { addTemplate } from "@/lib/community-templates";
import { CommunityTemplate, CVTemplateId } from "@/lib/schemas";
import { GROQ_MODEL_TEMPLATE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { email, prompt, name } = (await request.json()) as {
      email: string;
      prompt: string;
      name?: string;
    };

    if (!email || !prompt) {
      return NextResponse.json(
        { error: "email and prompt are required" },
        { status: 400 }
      );
    }

    const { allowed } = await checkRateLimit(email, "generation");
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded. You can generate 5 templates per day.",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const messages = [
      { role: "system" as const, content: LLAMA_TEMPLATE_SYSTEM_PROMPT },
      {
        role: "user" as const,
        content: `Generate a CV template configuration for the following description:\n\n"${prompt}"`,
      },
    ];

    const raw = await groqChat({
      model: GROQ_MODEL_TEMPLATE,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
      responseFormat: { type: "json_object" },
    });

    let config: Record<string, any>;
    try {
      config = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "AI returned malformed JSON", raw },
        { status: 502 }
      );
    }

    const template = addTemplate({
      name: name || config.name || "Untitled Template",
      description: config.description || "",
      prompt,
      category: config.category || "Professional",
      style: (config.style as CVTemplateId) || "minimalist",
      layout: config.layout || "single-column",
      colors: config.colors || {
        primary: "#ff0033",
        secondary: "#1a1a2e",
        accent: "#e94560",
        background: "#ffffff",
        text: "#1a1a2e",
      },
      fonts: config.fonts || {
        heading: "Inter",
        body: "Inter",
      },
      generatedBy: name || "Anonymous",
      generatedByEmail: email,
    });

    await incrementRateLimit(email, "generation");

    const { remaining } = await checkRateLimit(email, "generation");

    return NextResponse.json({
      template,
      remaining,
    });
  } catch (error: any) {
    console.error("/api/ai/generate-template error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
