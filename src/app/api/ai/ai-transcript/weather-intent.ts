import OpenAI from "openai";
import { langfuse } from "./langfuse";
import { MODELS } from "@/models/models";

const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY1,
    baseURL: process.env.NVIDIA_BASE_URL,
  });

  
// Pass the active trace into the function to tie them together
export async function getWeatherIntent(question: string, trace: any) {
  // 3. Fetch prompt from Langfuse (looks for "production" label by default)
  const langfusePrompt = await langfuse.getPrompt("weather_intent_classifier");
  const compiledSystemPrompt = langfusePrompt.compile();

  const messages = [
    {
      role: "system" as const,
      content: compiledSystemPrompt,
    },
    {
      role: "user" as const,
      content: question,
    },
  ];

  // 4. Create a generation block inside your Langfuse trace
  const generation = trace.generation({
    name: "weather-intent-classification",
    model: MODELS.LLAMA_70B, // "meta/llama-3.3-70b-instruct",
    modelParameters: { temperature: 0, max_tokens: 100 },
    input: messages,
    prompt: langfusePrompt, // Links the version to this run
  });

  const completion = await openai.chat.completions.create({
    model: MODELS.LLAMA_70B,// "meta/llama-3.3-70b-instruct",
    temperature: 0,
    max_tokens: 100,
    messages: messages,
  });

  const raw = completion.choices[0].message.content?.trim() || "{}";

  // 5. Complete the Langfuse generation log
  generation.end({
    output: raw,
    usage: {
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    },
  });

  try {
    return JSON.parse(raw.replace(/```json|```/g, ""));
  } catch {
    return {
      isWeather: false,
      city: "",
    };
  }
}