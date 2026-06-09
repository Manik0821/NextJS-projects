import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

function isWeatherQuestion(text: string) {
  const q = text.toLowerCase();

  return (
    q.includes("weather") ||
    q.includes("temperature") ||
    q.includes("forecast") ||
    q.includes("humidity") ||
    q.includes("wind") ||
    q.includes("rain")
  );
}

function extractCity(text: string) {
  const match = text.match(
    /(?:in|for|at)\s+([a-zA-Z\s]+)/i
  );

  return match?.[1]?.trim() || "London";
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
        { status: 400 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `
You are a helpful AI assistant.

Rules:
- Answer naturally.
- Use previous conversation context.
- If weather data is supplied, use it.
- Temperature should be in °C.
- Wind speed should be in km/h.
- Summarize forecast and historical trends naturally.
- Keep your answer Concise.
`,
    };

    const fullMessages: any[] = [
      systemPrompt,
      ...history,
    ];

    // Latest user message
    const latestUserMessage = [...history]
      .reverse()
      .find((m) => m.role === "user");

    if (
      latestUserMessage &&
      isWeatherQuestion(latestUserMessage.content)
    ) {
      const city = extractCity(
        latestUserMessage.content
      );

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

        fullMessages.push({
          role: "system",
          content: `
Weather information for ${city}

Current Conditions:
Temperature: ${current.current.temperature_2m} °C
Humidity: ${current.current.relative_humidity_2m} %
Wind Speed: ${current.current.wind_speed_10m} km/h

Forecast Data:
${JSON.stringify(forecast)}

Historical Data:
${JSON.stringify(historical)}

Use this information to answer weather-related questions.
Do not mention raw JSON.
Give concise and natural answers.
`,
        });
      } catch (weatherError) {
        console.error(
          "Weather API Error:",
          weatherError
        );
      }
    }

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
        "Agent returned an empty choices array."
      );
    }

    const aiResponse =
      completion.choices[0].message?.content ||
      "No response generated.";

    return NextResponse.json(
      {
        response: aiResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "NVIDIA API Error Detail:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to communicate with AI Assistant via NVIDIA",
        details: error.message,
      },
      { status: 500 }
    );
  }
}