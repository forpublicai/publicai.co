import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 60;

const systemPrompt = readFileSync(
  join(process.cwd(), "src/app/api/dialogue/interview_prompt.md"),
  "utf-8"
);

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter.chat("google/gemini-3.1-flash-lite-preview"),
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    system: systemPrompt,
  });

  return result.toUIMessageStreamResponse();
}
