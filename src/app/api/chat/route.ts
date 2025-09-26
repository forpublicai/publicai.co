import { createOpenAI } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { convertToModelMessages, streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";

export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: "https://api-internal.publicai.co/v1",
  apiKey: process.env.LITELLM_API_KEY,
});

// Load system prompt
const systemPrompt = readFileSync(
  join(process.cwd(), 'src/app/api/chat/system_prompt.md'),
  'utf-8'
);

export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: openai.chat("swiss-ai/apertus-8b-instruct"),
    messages: convertToModelMessages(messages),
    system: systemPrompt,
    tools: {
      ...frontendTools(tools),
      // add backend tools here
    },
  });

  return result.toUIMessageStreamResponse();
}
