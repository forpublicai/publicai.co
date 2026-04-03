import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { readFileSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { Readable } from "stream";

export const maxDuration = 60;

const systemPrompt = readFileSync(
  join(process.cwd(), "src/app/api/dialogue/interview_prompt.md"),
  "utf-8"
);

// Node.js 22 TLS can't connect to Cloudflare-fronted APIs on this system.
// Use curl subprocess as a streaming fetch proxy.
function curlFetch(
  url: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const urlStr =
    typeof url === "string"
      ? url
      : url instanceof URL
        ? url.toString()
        : url.url;
  const method = init?.method ?? "GET";
  const headers = init?.headers;
  const body = init?.body;

  return new Promise((resolve, reject) => {
    const args = [
      "-s",
      "-S",
      "--http1.1",
      "-X",
      method,
      "-D",
      "/dev/stderr",
      urlStr,
    ];

    if (headers) {
      const entries =
        headers instanceof Headers
          ? Array.from(headers.entries())
          : Array.isArray(headers)
            ? headers
            : Object.entries(headers);
      for (const [key, value] of entries) {
        args.push("-H", `${key}: ${value}`);
      }
    }

    if (body) {
      args.push("-d", "@-");
    }

    const proc = spawn("curl", args, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let headerText = "";

    proc.stderr.on("data", (data: Buffer) => {
      headerText += data.toString();
    });

    if (body) {
      const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
      proc.stdin.write(bodyStr);
      proc.stdin.end();
    }

    let headersResolved = false;

    const tryResolveHeaders = () => {
      if (headersResolved) return;
      const endIdx = headerText.indexOf("\r\n\r\n");
      if (endIdx === -1) return;
      headersResolved = true;

      const blocks = headerText.split("\r\n\r\n").filter(Boolean);
      const lastBlock = blocks[blocks.length - 1] || blocks[0] || "";
      const headerLines = lastBlock.split("\r\n");
      const statusLine = headerLines[0] || "";
      const statusMatch = statusLine.match(/HTTP\/[\d.]+ (\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 200;

      const responseHeaders = new Headers();
      for (let i = 1; i < headerLines.length; i++) {
        const colonIdx = headerLines[i].indexOf(":");
        if (colonIdx > 0) {
          responseHeaders.append(
            headerLines[i].slice(0, colonIdx).trim(),
            headerLines[i].slice(colonIdx + 1).trim()
          );
        }
      }

      const webStream = Readable.toWeb(proc.stdout) as ReadableStream;
      resolve(new Response(webStream, { status, headers: responseHeaders }));
    };

    proc.stderr.on("data", tryResolveHeaders);
    proc.stderr.on("end", tryResolveHeaders);
    proc.on("error", (err: Error) => {
      if (!headersResolved) reject(err);
    });
    proc.on("close", (code: number | null) => {
      if (!headersResolved) {
        reject(new Error(`curl exited with code ${code}`));
      }
    });
  });
}

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  fetch: curlFetch as typeof globalThis.fetch,
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
