// src/app/api/ai-transcript/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  // FIXED: Changed from 'https://nvidia.com' to the precise NVIDIA NIM v1 gateway URL
  baseURL: 'https://integrate.api.nvidia.com/v1', 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json({ error: 'Chat conversation history payload is required' }, { status: 400 });
    }

    // System prompt sets rules for Llama behavior
    const systemPrompt = {
        role: "system",
        content: "You are an expert AI transcription analyst. Answer questions concisely using context from past dialogues."
    };

    // Combine system instructions with full timeline array 
    const fullMessages = [systemPrompt, ...history];

    // Call the Llama 3.3 70B model hosted on NVIDIA NIM
    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: fullMessages as any,
      temperature: 0.3,
      max_tokens: 1024,
    });

    // Safe extraction fallback checking if choices array is present and populated
    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("NVIDIA NIM returned an empty choices array. Check API balance or limits.");
    }

    const aiResponse = completion.choices[0].message?.content || "No text content generated.";

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error: any) {
    console.error('NVIDIA API Error Detail:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with Llama 3.3 via NVIDIA', details: error.message },
      { status: 500 }
    );
  }
}
