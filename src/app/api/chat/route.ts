import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "swiss-ai/apertus-8b-it" } = await req.json();

    // Create client for Swiss AI API
    const client = new OpenAI({
      apiKey: process.env.LITELLM_API_KEY!,
      baseURL: "https://api-internal.publicai.co/v1",
    });

    // Read system prompt from file
    const systemPromptPath = join(process.cwd(), 'src/app/api/chat/system_prompt.md');
    const systemPromptContent = readFileSync(systemPromptPath, 'utf-8');
    
    const systemPrompt = {
      role: "system" as const,
      content: systemPromptContent
    };

    const messagesWithSystem = [systemPrompt, ...messages];
    
    const stream = await client.chat.completions.create({
      model,
      messages: messagesWithSystem,
      stream: true,
    });

    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}