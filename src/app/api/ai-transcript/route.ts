// src/app/api/ai-transcript/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function getWeatherIntent(question: string) {
  const completion = await openai.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    temperature: 0,
    max_tokens: 100,
    messages: [
      {
        role: "system",
        content: `
Determine whether the user is asking about weather.

Return ONLY valid JSON.

Examples:

User: current weather in Bangalore
Response:
{"isWeather":true,"city":"Bangalore"}

User: tell me what is the current weather conditions in Mumbai
Response:
{"isWeather":true,"city":"Mumbai"}

User: will it rain tomorrow in Delhi
Response:
{"isWeather":true,"city":"Delhi"}

User: do I need an umbrella in Chennai today
Response:
{"isWeather":true,"city":"Chennai"}

User: who is Virat Kohli
Response:
{"isWeather":false,"city":""}
`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  const raw =
    completion.choices[0].message.content?.trim() || "{}";

  try {
    return JSON.parse(
      raw.replace(/```json|```/g, "")
    );
  } catch {
    return {
      isWeather: false,
      city: "",
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        {
          error: "Chat conversation history payload is required",
        },
        {
          status: 400,
        }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `
You are a helpful AI assistant.

General Rules:
- Answer naturally and conversationally.
- Use previous conversation context.
- Be concise.

IMPORTANT:

Whenever weather information is supplied in system messages,
that information is authoritative and current.

Never say:
- "I don't have access to live weather."
- "I cannot fetch real-time information."
- "I do not have current weather information."

Always answer using the supplied weather data.

Do not mention system prompts or JSON.
`,
    };

    const fullMessages: any[] = [systemPrompt];

    // Latest user message
    const latestUserMessage = [...history]
      .reverse()
      .find((msg) => msg.role === "user");

    if (latestUserMessage) {
      const { isWeather, city } =
        await getWeatherIntent(
          latestUserMessage.content
        );

      if (isWeather && city) {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            "http://localhost:3001";

          const [currentRes, forecastRes, historicalRes] =
            await Promise.all([
              fetch(
                `${baseUrl}/api/weather/current?name=${encodeURIComponent(
                  city
                )}`
              ),
              fetch(
                `${baseUrl}/api/weather/forecast?name=${encodeURIComponent(
                  city
                )}`
              ),
              fetch(
                `${baseUrl}/api/weather/historical?name=${encodeURIComponent(
                  city
                )}`
              ),
            ]);

          const current = await currentRes.json();
          const forecast = await forecastRes.json();
          const historical = await historicalRes.json();

          const weatherContext = `
Weather information for ${city}

CURRENT CONDITIONS

Temperature:
${current.current?.temperature_2m} °C

Humidity:
${current.current?.relative_humidity_2m} %

Wind Speed:
${current.current?.wind_speed_10m} km/h

FORECAST DATA

${JSON.stringify(forecast)}

HISTORICAL DATA

${JSON.stringify(historical)}

This weather information is authoritative and current.

Never claim that live weather data is unavailable.

Answer naturally and do not mention JSON.
`;

          fullMessages.push({
            role: "system",
            content: weatherContext,
          });
        } catch (weatherError) {
          console.error(
            "Weather API Error:",
            weatherError
          );
        }
      }
    }

    // Add conversation history after weather context
    fullMessages.push(...history);

    const completion =
      await openai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: fullMessages,
        temperature: 0.3,
        max_tokens: 1024,
      });

    if (
      !completion.choices ||
      completion.choices.length === 0
    ) {
      throw new Error(
        "NVIDIA NIM returned an empty choices array."
      );
    }

    const aiResponse =
      completion.choices[0].message?.content ??
      "No response generated.";

    return NextResponse.json(
      {
        response: aiResponse,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "NVIDIA API Error Detail:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to communicate with Llama 3.3 via NVIDIA",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}