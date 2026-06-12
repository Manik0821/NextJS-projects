import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      systemPrompt,
      prompt,
      temperature = 0.5,
      maxTokens = 300,
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

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      temperature,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content:
            systemPrompt ??
            "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      text:
        completion.choices[0].message.content ??
        "",
    });
  } catch (error: any) {
    console.error(error);

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