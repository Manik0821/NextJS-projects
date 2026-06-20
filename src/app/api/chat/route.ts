import { NextResponse } from "next/server";
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";
import { MODELS } from "@/models/models";

// ✅ Use NVIDIA_API_KEY1 exactly like your other working files
const openai = observeOpenAI(
  new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY1,
    baseURL: process.env.NVIDIA_BASE_URL, 
  })
);

export async function GET() {
  try {
    const res = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say 'Hello World from Langfuse!'" }],
      // ✅ Use a model your NVIDIA API key is approved to call
      model: MODELS.LLAMA_8B, 
    });

    const replyMessage = res.choices[0]?.message?.content || "No response text";
    return NextResponse.json({ reply: replyMessage });

  } catch (error: any) {
    console.error("Error details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
