import { MODELS } from "@/models/models";
import type OpenAI from "openai";

import type {
  SchedulerAIRequest,
  SchedulerIntentResult,
} from "./types";

export type { SchedulerAIRequest, SchedulerIntentResult } from "./types";

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return formatDate(date);
}

export function safeJsonParse<T>(text: string): T | null {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

export function cleanString(value?: string) {
  const clean = value?.trim();

  if (!clean) return undefined;

  const lowered = clean.toLowerCase();

  if (
    lowered === "missing" ||
    lowered === "unknown" ||
    lowered === "null" ||
    lowered === "undefined" ||
    lowered === "mongo-id"
  ) {
    return undefined;
  }

  return clean;
}

export function normalizeTaskId(value?: string) {
  return cleanString(value);
}

export function isValidDate(value?: string) {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTime(value?: string) {
  return !!value && /^\d{2}:\d{2}$/.test(value);
}

export function userMentionedExplicitDate(message: string) {
  const text = message.toLowerCase();

  return (
    /\d{4}-\d{2}-\d{2}/.test(text) ||
    /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(text) ||
    /\b(today|tomorrow|yesterday)\b/.test(text) ||
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(text) ||
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(text) ||
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(text)
  );
}

export function normalizeParsedDates(
  parsed: SchedulerIntentResult,
  message: string,
  selectedDate: string,
  currentDate: string
) {
  const hasExplicitDate = userMentionedExplicitDate(message);

  if (parsed.intent === "create" && parsed.task) {
    if (!parsed.task.date || !hasExplicitDate || parsed.task.date < currentDate) {
      parsed.task.date = selectedDate;
    }

    if (parsed.task.repeat?.enabled) {
      if (!parsed.task.repeat.until || parsed.task.repeat.until < parsed.task.date) {
        parsed.task.repeat.until = addDays(parsed.task.date, 7);
      }
    }
  }

  if (parsed.intent === "query") {
    if (!parsed.startDate || !parsed.endDate || !hasExplicitDate) {
      parsed.startDate = selectedDate;
      parsed.endDate = selectedDate;
    }
  }

  if (parsed.intent === "delete_occurrence" && !parsed.occurrenceDate) {
    parsed.occurrenceDate = selectedDate;
  }

  return parsed;
}

export function normalizeLookupFields(
  parsed: SchedulerIntentResult,
  selectedDate: string
) {
  parsed.taskId = normalizeTaskId(parsed.taskId);

  if (
    parsed.intent !== "delete_series" &&
    parsed.intent !== "delete_occurrence" &&
    parsed.intent !== "update"
  ) {
    return parsed;
  }

  const lookup = parsed.lookup ?? {};
  const task = parsed.task ?? {};

  const normalizedLookup = {
    title:
      cleanString(lookup.title) ??
      cleanString(parsed.title) ??
      cleanString(task.title),

    date:
      cleanString(lookup.date) ??
      cleanString(parsed.date) ??
      cleanString(task.date) ??
      cleanString(parsed.occurrenceDate) ??
      selectedDate,

    startTime:
      cleanString(lookup.startTime) ??
      cleanString(parsed.startTime) ??
      cleanString(task.startTime),

    endTime:
      cleanString(lookup.endTime) ??
      cleanString(parsed.endTime) ??
      cleanString(task.endTime),
  };

  const hasLookup =
    !!normalizedLookup.title ||
    !!normalizedLookup.startTime ||
    !!normalizedLookup.endTime;

  if (hasLookup) {
    parsed.lookup = normalizedLookup;
  }

  return parsed;
}

async function findTaskIdFromLookup(
  lookup: {
    title?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  },
  fallbackDate: string,
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
  targetOccurrenceDate?: string
) {
  const searchStart =
    targetOccurrenceDate ??
    lookup.date ??
    lookup.startDate ??
    fallbackDate;

  const searchEnd =
    targetOccurrenceDate ??
    lookup.date ??
    lookup.endDate ??
    searchStart;

  const res = await fetchImpl(
    `${baseUrl}/api/tasks?startDate=${searchStart}&endDate=${searchEnd}`,
    {
      cache: "no-store",
    }
  );

  const json = await res.json();

  const tasks = Array.isArray(json.data) ? json.data : [];

  const titleQuery = lookup.title?.toLowerCase().trim();

  function titleMatches(task: any) {
    if (!titleQuery) return true;

    return task.title?.toLowerCase().includes(titleQuery);
  }

  function exactTimeMatches(task: any) {
    const startMatches = lookup.startTime
      ? task.startTime === lookup.startTime
      : true;

    const endMatches = lookup.endTime
      ? task.endTime === lookup.endTime
      : true;

    return startMatches && endMatches;
  }

  function occurrenceMatches(task: any) {
    return targetOccurrenceDate
      ? (task.dateKey ?? task.date) === targetOccurrenceDate
      : true;
  }

  let matches = tasks.filter((task: any) => {
    return (
      titleMatches(task) &&
      exactTimeMatches(task) &&
      occurrenceMatches(task)
    );
  });

  if (matches.length === 0 && titleQuery) {
    matches = tasks.filter((task: any) => {
      return titleMatches(task) && occurrenceMatches(task);
    });
  }

  if (matches.length === 0) {
    return {
      success: false,
      message: "No matching task found for this title/date/time.",
      searched: {
        startDate: searchStart,
        endDate: searchEnd,
        targetOccurrenceDate,
        title: lookup.title,
        startTime: lookup.startTime,
        endTime: lookup.endTime,
      },
      availableTasks: tasks.map((task: any) => ({
        id: task.originalTaskId ?? task._id ?? task.id,
        title: task.title,
        date: task.dateKey ?? task.date,
        startTime: task.startTime,
        endTime: task.endTime,
      })),
    };
  }

  if (matches.length > 1) {
    return {
      success: false,
      requiresConfirmation: true,
      message: "Multiple matching tasks found. Please choose one.",
      matches: matches.map((task: any) => ({
        id: task.originalTaskId ?? task._id ?? task.id,
        title: task.title,
        date: task.dateKey ?? task.date,
        startTime: task.startTime,
        endTime: task.endTime,
      })),
    };
  }

  const task = matches[0];

  return {
    success: true,
    taskId: task.originalTaskId ?? task._id ?? task.id,
    occurrenceDate: task.dateKey ?? task.date,
    task,
  };
}

export async function getSchedulerIntent(
  userMessage: string,
  selectedDate: string,
  currentDate: string,
  trace: any,
  openaiClient: Pick<OpenAI, "chat" | "responses" | "models"> | any,
  promptLoader: (promptId: string) => Promise<any>
): Promise<SchedulerIntentResult> {
  const prompt = await promptLoader("Next-JS/Scheduler/scheduler_intent_extractor");

  const compiledPrompt = prompt.compile({
    selectedDate,
    currentDate,
  });

  const generation = trace.generation({
    name: "scheduler-intent-extraction",
    model: MODELS.LLAMA_70B,
    input: {
      userMessage,
      selectedDate,
      currentDate,
    },
    prompt,
  });

  const completion = await openaiClient.chat.completions.create({
    model: "meta/llama-3.3-70b-instruct",
    temperature: 0,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content: compiledPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const raw = completion.choices[0].message?.content ?? "";

  generation.end({
    output: raw,
    usage: {
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    },
  });

  return safeJsonParse<SchedulerIntentResult>(raw) ?? { intent: "unknown" };
}

export async function executeSchedulerAction(
  parsed: SchedulerIntentResult,
  selectedDate: string,
  baseUrl: string,
  fetchImpl: typeof fetch = fetch
) {
  if (parsed.intent === "query") {
    if (!isValidDate(parsed.startDate) || !isValidDate(parsed.endDate)) {
      return {
        success: false,
        message: "Query requires startDate and endDate.",
      };
    }

    const res = await fetchImpl(
      `${baseUrl}/api/tasks?startDate=${parsed.startDate}&endDate=${parsed.endDate}`,
      {
        cache: "no-store",
      }
    );

    return res.json();
  }

  if (parsed.intent === "create") {
    const task = parsed.task;

    if (
      !task?.title ||
      !isValidDate(task.date) ||
      !isValidTime(task.startTime) ||
      !isValidTime(task.endTime)
    ) {
      return {
        success: false,
        message: "Create requires title, date, startTime, and endTime.",
      };
    }

    const res = await fetchImpl(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description ?? "",
        date: task.date,
        startTime: task.startTime,
        endTime: task.endTime,
        priority: task.priority ?? "medium",
        status: task.status ?? "pending",
        color: task.color ?? "#3B82F6",
        repeat: task.repeat ?? {
          enabled: false,
          frequency: "none",
          interval: 1,
          until: "",
        },
        aiMetadata: {
          createdBy: "ai",
          intent: "create",
        },
      }),
    });

    return res.json();
  }

  if (parsed.intent === "update") {
  let taskId = normalizeTaskId(parsed.taskId);

  if (!taskId && parsed.lookup) {
    const lookupResult =
      await findTaskIdFromLookup(
        parsed.lookup,
        parsed.lookup.date ?? selectedDate,
        baseUrl,
        fetchImpl
      );

    if (!lookupResult.success) {
      return lookupResult;
    }

    taskId = lookupResult.taskId;
  }

  if (!taskId || !parsed.task) {
    return {
      success: false,
      message:
        "Update requires taskId/lookup and task payload.",
      parsed,
    };
  }

  const res = await fetch(
    `${baseUrl}/api/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.task),
    }
  );

  return res.json();
}

  if (parsed.intent === "delete_occurrence") {
    let taskId = normalizeTaskId(parsed.taskId);
    let occurrenceDate = parsed.occurrenceDate;

    if (!taskId && parsed.lookup) {
      const lookupResult = await findTaskIdFromLookup(
        parsed.lookup,
        parsed.lookup.date ?? occurrenceDate ?? selectedDate,
        baseUrl,
        fetchImpl
      );

      if (!lookupResult.success) {
        return lookupResult;
      }

      taskId = lookupResult.taskId;
      occurrenceDate = occurrenceDate ?? lookupResult.occurrenceDate;
    }

    if (!taskId || !isValidDate(occurrenceDate)) {
      return {
        success: false,
        message: "delete_occurrence requires taskId/lookup and occurrenceDate.",
      };
    }

    const res = await fetchImpl(
      `${baseUrl}/api/tasks/${taskId}?scope=occurrence&occurrenceDate=${occurrenceDate}`,
      {
        method: "DELETE",
      }
    );

    return res.json();
  }

  if (parsed.intent === "delete_series") {
    let taskId = normalizeTaskId(parsed.taskId);

    if (!taskId && parsed.lookup) {
      const lookupResult = await findTaskIdFromLookup(
        parsed.lookup,
        parsed.lookup.date ?? selectedDate,
        baseUrl,
        fetchImpl
      );

      if (!lookupResult.success) {
        return lookupResult;
      }

      taskId = lookupResult.taskId;
    }

    if (!taskId) {
      return {
        success: false,
        message: "delete_series requires taskId or lookup fields.",
        parsed,
      };
    }

    if (!parsed.confirm) {
      return {
        success: false,
        requiresConfirmation: true,
        message: "Deleting an entire recurring series requires confirmation.",
        preview: {
          ...parsed,
          taskId,
        },
      };
    }

    const res = await fetchImpl(`${baseUrl}/api/tasks/${taskId}?scope=series`, {
      method: "DELETE",
    });

    return res.json();
  }

  return {
    success: false,
    message: "I could not understand the scheduler action.",
  };
}
