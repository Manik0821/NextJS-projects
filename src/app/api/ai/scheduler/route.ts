import { NextResponse } from "next/server";

import { formatDate } from "./helper";
import { runSchedulerRequest } from "./scheduler.service";

import {
  createSchedulerTrace,
  safeFlushLangfuse,
  updateTrace,
} from "./observability";

import type {
  SchedulerAIRequest,
} from "./types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  console.log(
    `[AI Scheduler][${requestId}] POST request started`
  );

  const trace = createSchedulerTrace({
    requestId,
  });

  try {
    const body = await parseRequestBody(
      request,
      requestId
    );

    const selectedDate =
      body.context?.selectedDate ??
      formatDate(new Date());

    const currentDate =
      body.context?.currentDate ??
      formatDate(new Date());

    console.log(
      `[AI Scheduler][${requestId}] Request input:`,
      {
        message: body.message,
        selectedDate,
        currentDate,
        confirm: body.confirm ?? false,
      }
    );

    const validationResponse =
      validateMessage(
        body,
        requestId
      );

    if (validationResponse) {
      updateTrace(
        trace,
        {
          output: {
            error: "Missing message",
          },
        },
        requestId
      );

      return validationResponse;
    }

    updateTrace(
      trace,
      {
        input: {
          message: body.message,
          selectedDate,
          currentDate,
        },
      },
      requestId
    );

    const { parsed, result } =
      await runSchedulerRequest({
        body,
        selectedDate,
        currentDate,
        requestId,
        trace,
      });

    await safeFlushLangfuse(
      requestId
    );

    console.log(
      `[AI Scheduler][${requestId}] Request completed in ${
        Date.now() - startedAt
      }ms`
    );

    return NextResponse.json(
      {
        success: true,
        requestId,
        parsed,
        result,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    return handleSchedulerError({
      error,
      trace,
      requestId,
      startedAt,
    });
  }
}

async function parseRequestBody(
  request: Request,
  requestId: string
): Promise<SchedulerAIRequest> {
  try {
    return (
      (await request.json()) as SchedulerAIRequest
    );
  } catch {
    console.error(
      `[AI Scheduler][${requestId}] Invalid JSON request body`
    );

    throw new SchedulerRequestError(
      "Invalid JSON request body.",
      400
    );
  }
}

function validateMessage(
  body: SchedulerAIRequest,
  requestId: string
) {
  if (
    typeof body.message === "string" &&
    body.message.trim()
  ) {
    return null;
  }

  console.error(
    `[AI Scheduler][${requestId}] Message is missing`
  );

  return NextResponse.json(
    {
      success: false,
      requestId,
      message: "Message is required.",
    },
    {
      status: 400,
    }
  );
}

interface HandleErrorOptions {
  error: unknown;
  trace: any;
  requestId: string;
  startedAt: number;
}

async function handleSchedulerError({
  error,
  trace,
  requestId,
  startedAt,
}: HandleErrorOptions) {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown scheduler error.";

  const status =
    error instanceof SchedulerRequestError
      ? error.status
      : isTimeoutError(message)
        ? 504
        : 500;

  console.error(
    `[AI Scheduler][${requestId}] Request failed after ${
      Date.now() - startedAt
    }ms`
  );

  console.error(error);

  updateTrace(
    trace,
    {
      output: {
        errorMessage: message,
      },
    },
    requestId
  );

  await safeFlushLangfuse(
    requestId
  );

  return NextResponse.json(
    {
      success: false,
      requestId,
      message:
        status === 504
          ? "The AI provider took too long to respond."
          : status === 400
            ? message
            : "AI scheduler action failed.",
      details:
        status === 400
          ? undefined
          : message,
    },
    {
      status,
    }
  );
}

function isTimeoutError(
  message: string
) {
  const normalized =
    message.toLowerCase();

  return (
    normalized.includes("timeout") ||
    normalized.includes("timed out")
  );
}

class SchedulerRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "SchedulerRequestError";
  }
}