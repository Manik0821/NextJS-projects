import { NextResponse } from "next/server";
import OpenAI from "openai";

import { langfuse } from "../ai-transcript/langfuse";
import { getCachedPrompt } from "../ai-transcript/prompts";
import { MODELS } from "@/models/models";
import {
  executeSchedulerAction,
  formatDate,
  getSchedulerIntent,
  normalizeLookupFields,
  normalizeParsedDates,
} from "./helper";
import type { SchedulerAIRequest, SchedulerIntentResult } from "./types";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY1,
  baseURL: process.env.NVIDIA_BASE_URL,
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

export async function POST(request: Request) {
  const trace = langfuse.trace({
    name: "ai-scheduler-endpoint",
    metadata: {
      model: MODELS.LLAMA_70B,
      environment: process.env.NODE_ENV,
    },
  });

  try {
    const body =
      (await request.json()) as SchedulerAIRequest;

    const selectedDate =
      body.context?.selectedDate ??
      formatDate(new Date());

    const currentDate =
      body.context?.currentDate ??
      formatDate(new Date());

    if (
      !body.message ||
      typeof body.message !== "string"
    ) {
      trace.update({
        output: {
          error: "Missing message",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    trace.update({
      input: {
        message: body.message,
        selectedDate,
        currentDate,
      },
    });

    let parsed: SchedulerIntentResult = await getSchedulerIntent(
      body.message,
      selectedDate,
      currentDate,
      trace,
      openai,
      async (promptId: string) => getCachedPrompt(promptId)
    );

    parsed = normalizeParsedDates(
      parsed,
      body.message,
      selectedDate,
      currentDate
    );

    parsed = normalizeLookupFields(parsed, selectedDate);

    if (body.confirm) {
      parsed.confirm = true;
    }

    const actionGeneration =
      trace.generation({
        name: "scheduler-action-execution",
        model: "internal-api",
        input: parsed,
      });

    const result = await executeSchedulerAction(
      parsed,
      selectedDate,
      BASE_URL
    );

    actionGeneration.end({
      output: result,
    });

    trace.update({
      output: {
        parsed,
        result,
      },
    });

    await langfuse.flushAsync();

    return NextResponse.json(
      {
        success: true,
        parsed,
        result,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "POST /api/ai/scheduler error:",
      error
    );

    trace.update({
      output: {
        errorMessage: error.message,
      },
    });

    await langfuse.flushAsync();

    return NextResponse.json(
      {
        success: false,
        message:
          "AI scheduler action failed.",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}