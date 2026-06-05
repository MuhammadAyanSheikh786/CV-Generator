import { GEMINI_API_URL, GEMINI_MODEL_SCORING } from "@/lib/constants";

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiOptions {
  model?: string;
  systemInstruction: string;
  contents: GeminiContent[];
  temperature?: number;
  maxTokens?: number;
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
    finishReason?: string;
  }[];
}

export async function geminiChat(options: GeminiOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Set it in .env.local"
    );
  }

  const model = options.model ?? GEMINI_MODEL_SCORING;
  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: options.contents,
    systemInstruction: {
      parts: [{ text: options.systemInstruction }],
    },
    generationConfig: {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens ?? 4096,
      responseMimeType: "application/json",
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`Gemini API error (${response.status}): ${raw}`);
  }

  const data: GeminiResponse = JSON.parse(raw);
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text && data.candidates?.[0]?.finishReason) {
    throw new Error(
      `Gemini blocked response: ${data.candidates[0].finishReason}`
    );
  }

  return text;
}
