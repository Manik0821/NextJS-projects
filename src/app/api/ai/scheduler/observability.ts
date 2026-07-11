import { langfuse } from "../ai-transcript/langfuse";
import { MODELS } from "@/models/models";

interface CreateTraceOptions {
  requestId: string;
}

interface SchedulerTrace {
  update?: (data: any) => void;
  generation?: (data: any) => SchedulerGeneration;
}

interface SchedulerGeneration {
  end?: (data: any) => void;
}

export function createSchedulerTrace({
  requestId,
}: CreateTraceOptions): SchedulerTrace | null {
  try {
    return langfuse.trace({
      name: "ai-scheduler-endpoint",
      metadata: {
        requestId,
        model: MODELS.LLAMA_70B,
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.warn(
      `[AI Scheduler][${requestId}] Unable to create Langfuse trace:`,
      error
    );

    return null;
  }
}

export function updateTrace(
  trace: SchedulerTrace | null,
  data: unknown,
  requestId: string
) {
  try {
    trace?.update?.(data);
  } catch (error) {
    console.warn(
      `[AI Scheduler][${requestId}] Trace update failed:`,
      error
    );
  }
}

export function createActionGeneration(
  trace: SchedulerTrace | null,
  input: unknown,
  requestId: string
): SchedulerGeneration | null {
  try {
    return (
      trace?.generation?.({
        name: "scheduler-action-execution",
        model: "internal-api",
        input,
      }) ?? null
    );
  } catch (error) {
    console.warn(
      `[AI Scheduler][${requestId}] Action generation creation failed:`,
      error
    );

    return null;
  }
}

export function endGeneration(
  generation: SchedulerGeneration | null,
  output: unknown,
  requestId: string
) {
  try {
    generation?.end?.({
      output,
    });
  } catch (error) {
    console.warn(
      `[AI Scheduler][${requestId}] Action generation end failed:`,
      error
    );
  }
}

export async function safeFlushLangfuse(
  requestId: string
) {
  try {
    await Promise.race([
      langfuse.flushAsync(),

      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error("Langfuse flush timed out.")
          );
        }, 3_000);
      }),
    ]);
  } catch (error) {
    console.warn(
      `[AI Scheduler][${requestId}] Langfuse flush skipped:`,
      error instanceof Error
        ? error.message
        : error
    );
  }
}