// src/app/api/ai/ai-transcript/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getWeatherIntent } from "./weather-intent";
import { langfuse } from "./langfuse";
// import { MODELS } from "./models";
import { getCachedPrompt } from "./prompts";
import {TASK_CONFIG} from '@/models/tasks';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: process.env.NVIDIA_BASE_URL,
});

export async function POST(request: Request) {
  // Start an overall Langfuse Trace for this HTTP Request
  const trace = langfuse.trace({
    name: "ai-transcript-endpoint",
    metadata: {
      model: TASK_CONFIG.chat.model,
      environment: process.env.NODE_ENV,
    }
  });

  try {
    const body = await request.json();
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      trace.update({ output: { error: "Missing payload history" } });
      return NextResponse.json(
        { error: "Chat conversation history payload is required" },
        { status: 400 }
      );
    }

    // Log tracking metadata on your trace
    trace.update({
      input: { historyLength: history.length },
    });

    // Fetch the main assistant instructions from Langfuse
    const assistantPrompt = await getCachedPrompt("weather_assistant_main");
    const compiledAssistantPrompt = assistantPrompt.compile();


const systemPrompt: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam =
{
  role: "system",
  content: compiledAssistantPrompt,
};

    const fullMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemPrompt,
    ];

    // Latest user message
    const latestUserMessage = [...history]
      .reverse()
      .find((msg) => msg.role === "user");

    if (latestUserMessage) {
      // Pass trace instance along
      const { isWeather, city } = await getWeatherIntent(
        latestUserMessage.content,
        trace
      );

      if (isWeather && city) {
        try {
          // Fallback to http://localhost:3000 for local development to prevent SSL errors
          const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:3000";
  
          // Execute concurrent sub-route data fetching safely
          const [currentRes, forecastRes, historicalRes] = await Promise.all([
            fetch(`${baseUrl}/api/weather/current?name=${encodeURIComponent(city)}`),
            fetch(`${baseUrl}/api/weather/forecast?name=${encodeURIComponent(city)}`),
            fetch(`${baseUrl}/api/weather/historical?name=${encodeURIComponent(city)}`)
          ]);

          const current = await currentRes.json();
          const forecast = await forecastRes.json();
          const historical = await historicalRes.json();

          // Fetch context builder formatting wrapper from Langfuse 
          const contextPrompt = await getCachedPrompt("weather_context_wrapper");
          const weatherContext = contextPrompt.compile({
            city: city,
            temp: current.current?.temperature_2m ?? "N/A",
            humidity: current.current?.relative_humidity_2m ?? "N/A",
            wind: current.current?.wind_speed_10m ?? "N/A",
            forecast: JSON.stringify(forecast),
            historical: JSON.stringify(historical),
          });

          fullMessages.push({
            role: "system",
            content: weatherContext,
          });
        } catch (weatherError) {
          console.error("Weather API Error:", weatherError);
        }
      }
    }

    // Add conversation history after weather context
    fullMessages.push(...history);

    // Log the main final completion generation inside trace
    const modelConfig = TASK_CONFIG.chat;

const finalGeneration = trace.generation({
  name: "final-response-generation",
  model: modelConfig.model,
  modelParameters: {
    temperature: modelConfig.temperature,
    maxTokens: modelConfig.maxTokens,
  },
  input: fullMessages,
  prompt: assistantPrompt,
});

const completion =
  await openai.chat.completions.create({
    model: modelConfig.model,
    messages: fullMessages,
    temperature: modelConfig.temperature,
    max_tokens: modelConfig.maxTokens,
  });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("NVIDIA NIM returned an empty choices array.");
    }

    const aiResponse = completion.choices[0].message?.content ?? "No response generated.";

    // Close generation logs and send response
    finalGeneration.end({
      output: aiResponse,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      },
    });

    trace.update({ output: aiResponse });

    return NextResponse.json({ response: aiResponse }, { status: 200 });

  } catch (error: any) {
    console.error("NVIDIA API Error Detail:", error);

    trace.update({
      output: { errorMessage: error.message }
    });
    
    return NextResponse.json(
      {
        error: "Failed to communicate with Llama 3.3 via NVIDIA",
        details: error.message,
      },
      { status: 500 }
    );
  }
  finally {
    await langfuse.flushAsync();
  }
}