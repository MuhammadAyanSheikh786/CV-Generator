import { NextRequest, NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { LLAMA_ENHANCE_SYSTEM_PROMPT } from "@/lib/ai-prompts";
import { GROQ_MODEL_ENHANCE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { text, context } = (await request.json()) as {
      text: string;
      context?: string;
    };

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const userMessage = context
      ? `Context: ${context}\n\nText to enhance:\n${text}`
      : `Text to enhance:\n${text}`;

    const messages = [
      { role: "system" as const, content: LLAMA_ENHANCE_SYSTEM_PROMPT },
      { role: "user" as const, content: userMessage },
    ];

    const enhanced = await groqChat({
      model: GROQ_MODEL_ENHANCE,
      messages,
      temperature: 0.5,
      maxTokens: 1024,
    });

    return NextResponse.json({ enhanced: enhanced.trim() });
  } catch (error: any) {
    console.error("/api/ai/enhance error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
