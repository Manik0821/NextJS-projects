import { getCachedPrompt } from "../ai-transcript/prompts";

import {
  executeSchedulerAction,
  getSchedulerIntent,
  normalizeLookupFields,
  normalizeParsedDates,
} from "./helper";

import {
  BASE_URL,
  openai,
} from "./config";

import {
  createActionGeneration,
  endGeneration,
  updateTrace,
} from "./observability";

import type {
  SchedulerAIRequest,
  SchedulerIntentResult,
} from "./types";

interface SchedulerExecutionOptions {
  body: SchedulerAIRequest;
  selectedDate: string;
  currentDate: string;
  requestId: string;
  trace: any;
}

export interface SchedulerExecutionResult {
  parsed: SchedulerIntentResult;
  result: unknown;
}

export async function runSchedulerRequest({
  body,
  selectedDate,
  currentDate,
  requestId,
  trace,
}: SchedulerExecutionOptions): Promise<SchedulerExecutionResult> {
  console.log(
    `[AI Scheduler][${requestId}] Starting intent extraction`
  );

  const intentStartedAt = Date.now();

  let parsed: SchedulerIntentResult =
    await getSchedulerIntent(
      body.message.trim(),
      selectedDate,
      currentDate,
      trace,
      openai,
      getCachedPrompt
    );

  console.log(
    `[AI Scheduler][${requestId}] Intent extracted in ${
      Date.now() - intentStartedAt
    }ms`
  );

  console.dir(parsed, {
    depth: null,
  });

  parsed = normalizeParsedDates(
    parsed,
    body.message,
    selectedDate,
    currentDate
  );

  console.log(
    `[AI Scheduler][${requestId}] After date normalization`
  );

  console.dir(parsed, {
    depth: null,
  });

  parsed = normalizeLookupFields(
    parsed,
    selectedDate
  );

  console.log(
    `[AI Scheduler][${requestId}] After lookup normalization`
  );

  console.dir(parsed, {
    depth: null,
  });

  if (body.confirm === true) {
    parsed.confirm = true;

    console.log(
      `[AI Scheduler][${requestId}] Confirmation applied`
    );
  }

  const actionGeneration =
    createActionGeneration(
      trace,
      parsed,
      requestId
    );

  console.log(
    `[AI Scheduler][${requestId}] Executing action: ${parsed.intent}`
  );

  const actionStartedAt = Date.now();

  const result =
    await executeSchedulerAction(
      parsed,
      selectedDate,
      BASE_URL
    );

  console.log(
    `[AI Scheduler][${requestId}] Action completed in ${
      Date.now() - actionStartedAt
    }ms`
  );

  console.dir(result, {
    depth: null,
  });

  endGeneration(
    actionGeneration,
    result,
    requestId
  );

  updateTrace(
    trace,
    {
      output: {
        parsed,
        result,
      },
    },
    requestId
  );

  return {
    parsed,
    result,
  };
}