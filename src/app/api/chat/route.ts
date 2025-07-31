import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

function getClientConfig(model: string) {
  if (model.startsWith('aisingapore/')) {
    return {
      apiKey: process.env.SEALION_API_KEY!,
      baseURL: "https://api.sea-lion.ai/v1",
    };
  }
  
  // Default to OpenRouter for Mistral and other models
  return {
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "aisingapore/Gemma-SEA-LION-v3-9B-IT" } = await req.json();

    // Create client with appropriate configuration
    const config = getClientConfig(model);
    const client = new OpenAI(config);
    
    const stream = await client.chat.completions.create({
      model,
      messages,
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
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}