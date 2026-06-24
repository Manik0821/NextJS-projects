import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { langfuse } from "../ai-transcript/langfuse";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: process.env.NVIDIA_BASE_URL,
});

const fallbackSystemPrompt = `
You are a concise AI assistant.

Rules:
- Ignore raw JavaScript object syntax.
- If objects appear in the prompt, extract useful information only.
- Never mention "[object Object]".
- Answer naturally.
- Keep responses brief and readable.
- Do not say things like given incomplete info or analysis of.
- Give answer from whatever you have got.
`;

const pendingRequests = new Map<string, Promise<string>>();

async function resolveSystemPrompt(
  promptName: string,
  variables: Record<string, any> = {}
) {
  try {
    // console.log("Fetching Langfuse prompt:", promptName);

    const langfusePrompt = await langfuse.getPrompt(promptName);

    if (!langfusePrompt) {
      console.error("Prompt not found:", promptName);
      return fallbackSystemPrompt;
    }

    const compiledPrompt =
      typeof langfusePrompt.compile === "function"
        ? langfusePrompt.compile(variables)
        : langfusePrompt.prompt;

    // console.log("Successfully resolved prompt:", promptName);
    console.log("Compiled prompt:", compiledPrompt);

    return typeof compiledPrompt === "string"
      ? compiledPrompt
      : JSON.stringify(compiledPrompt);
  } catch (err) {
    console.error(
      `Failed to fetch Langfuse prompt: ${promptName}`,
      err
    );

    return fallbackSystemPrompt;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      systemPrompt,
      variables = {},
      temperature = 0.3,
      maxTokens = 180,
    } = body;

    if (!systemPrompt) {
      return NextResponse.json(
        {
          error: "systemPrompt is required",
        },
        {
          status: 400,
        }
      );
    }

    const resolvedSystemPrompt = await resolveSystemPrompt(
      systemPrompt,
      variables
    );

    const trace = langfuse.trace({
      name: "ai-generate",
      metadata: {
        promptName: systemPrompt,
        environment: process.env.NODE_ENV,
      },
    });

    const generation = trace.generation({
      name: "ai-summary-generation",
      model: "meta/llama-3.1-8b-instruct",
      modelParameters: {
        temperature,
        maxTokens,
      },
      input: {
        systemPrompt: resolvedSystemPrompt,
        variables,
      },
    });

    const cacheKey = JSON.stringify({
      systemPrompt,
      variables,
      temperature,
      maxTokens,
    });

    if (pendingRequests.has(cacheKey)) {
      const text = await pendingRequests.get(cacheKey)!;

      return NextResponse.json({
        text,
      });
    }

    const promise = (async () => {
      try {
        const completion = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          temperature,
          max_tokens: maxTokens,
          messages: [
            {
              role: "system",
              content: resolvedSystemPrompt,
            },
            {
              role: "user",
              content: "Generate the requested summary.",
            },
          ],
        });

        const text =
          completion.choices?.[0]?.message?.content?.trim() ?? "";

        generation.end({
          output: text,
          usage: {
            promptTokens: completion.usage?.prompt_tokens,
            completionTokens: completion.usage?.completion_tokens,
          },
        });

        trace.update({
          output: text,
        });

        return text;
      } catch (error) {
        generation.end({
          output: {
            error:
              error instanceof Error
                ? error.message
                : String(error),
          },
        });

        trace.update({
          output: {
            error:
              error instanceof Error
                ? error.message
                : String(error),
          },
        });

        throw error;
      }
    })();

    pendingRequests.set(cacheKey, promise);

    try {
      const text = await promise;

      return NextResponse.json({
        text,
      });
    } finally {
      pendingRequests.delete(cacheKey);
      await langfuse.flushAsync();
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