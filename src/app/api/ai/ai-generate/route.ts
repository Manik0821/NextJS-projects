import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Prevent duplicate requests
const pendingRequests = new Map<string, Promise<string>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      systemPrompt,
      prompt,
      temperature = 0.3,
      maxTokens = 180,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        {
          error: "prompt is required",
        },
        {
          status: 400,
        }
      );
    }

    // Key for deduplication
    const cacheKey = JSON.stringify({
      systemPrompt,
      prompt,
      temperature,
      maxTokens,
    });

    // If same request is already running, reuse it
    if (pendingRequests.has(cacheKey)) {
      const text = await pendingRequests.get(cacheKey)!;

      return NextResponse.json({
        text,
      });
    }

    const promise = (async () => {
      const completion = await openai.chat.completions.create({
        // Faster model
        model: "meta/llama-3.1-8b-instruct",

        temperature,

        max_tokens: maxTokens,

        messages: [
          {
            role: "system",
            content:
              systemPrompt ??
              `
You are a concise AI assistant.

Rules:
- Ignore raw JavaScript object syntax.
- If objects appear in the prompt, extract useful information only.
- Never mention "[object Object]".
- Answer naturally.
- Keep responses brief and readable.
- Do not say things like given incomplete info or analysis of.
- Give answer from whatever you have got.
`
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      return (
        completion.choices[0].message.content?.trim() ??
        ""
      );
    })();

    pendingRequests.set(cacheKey, promise);

    try {
      const text = await promise;

      return NextResponse.json({
        text,
      });
    } finally {
      pendingRequests.delete(cacheKey);
    }
  } catch (error: any) {
    console.error("AI Generate Error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}