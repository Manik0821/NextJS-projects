import { NextRequest, NextResponse } from "next/server";

import Task from "@/db/models/Task";
import { connectDB } from "@/lib/DB/mongodb";

type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

type RepeatOptions = {
  enabled: boolean;
  frequency: RepeatFrequency;
  interval: number;
  until: string;
};

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function parseDateKey(value: string) {
  const [year, month, day] = value
    .substring(0, 10)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDate(
  dateKey: string,
  frequency: RepeatFrequency,
  interval: number
) {
  const date = parseDateKey(dateKey);

  if (frequency === "daily") {
    date.setDate(date.getDate() + interval);
  }

  if (frequency === "weekly") {
    date.setDate(date.getDate() + interval * 7);
  }

  if (frequency === "monthly") {
    date.setMonth(date.getMonth() + interval);
  }

  if (frequency === "yearly") {
    date.setFullYear(date.getFullYear() + interval);
  }

  return formatDateKey(date);
}

function normalizeRepeat(repeat?: Partial<RepeatOptions>): RepeatOptions {
  if (!repeat?.enabled) {
    return {
      enabled: false,
      frequency: "none",
      interval: 1,
      until: "",
    };
  }

  return {
    enabled: true,
    frequency:
      repeat.frequency && repeat.frequency !== "none"
        ? repeat.frequency
        : "daily",
    interval: Math.max(Number(repeat.interval) || 1, 1),
    until: repeat.until || "",
  };
}

function normalizeTask(task: any, occurrenceDateKey?: string) {
  const baseDateKey =
    task.dateKey ?? formatDateKey(new Date(task.date));

  const dateKey = occurrenceDateKey ?? baseDateKey;

  const id = occurrenceDateKey
    ? `${String(task._id)}-${dateKey}`
    : String(task._id);

  return {
    ...task,
    _id: String(task._id),
    id,
    originalTaskId: String(task._id),
    isRecurringOccurrence: Boolean(occurrenceDateKey),

    date: dateKey,
    dateKey,

    startMinutes: timeToMinutes(task.startTime),
    endMinutes: timeToMinutes(task.endTime),

    repeat: normalizeRepeat(task.repeat),
  };
}

function expandTasks(tasks: any[], startDate: string, endDate: string) {
  const output: any[] = [];

  for (const task of tasks) {
    const repeat = normalizeRepeat(task.repeat);

    const taskDateKey =
      task.dateKey ?? formatDateKey(new Date(task.date));

    if (!repeat.enabled) {
      if (taskDateKey >= startDate && taskDateKey <= endDate) {
        output.push(normalizeTask(task));
      }

      continue;
    }

    let currentDateKey = taskDateKey;

    const untilDateKey = repeat.until || endDate;

    while (
      currentDateKey <= endDate &&
      currentDateKey <= untilDateKey
    ) {
      if (currentDateKey >= startDate) {
        output.push(normalizeTask(task, currentDateKey));
      }

      currentDateKey = addDate(
        currentDateKey,
        repeat.frequency,
        repeat.interval
      );
    }
  }

  return output.sort((a, b) => {
    if (a.dateKey !== b.dateKey) {
      return a.dateKey.localeCompare(b.dateKey);
    }

    return a.startMinutes - b.startMinutes;
  });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const startDate =
      date ?? searchParams.get("startDate");
    const endDate =
      date ?? searchParams.get("endDate");

    const rangeStart =
      startDate ?? formatDateKey(new Date());
    const rangeEnd =
      endDate ?? rangeStart;

    const tasks = await Task.find({}).lean();

    const data = expandTasks(
      tasks,
      rangeStart,
      rangeEnd
    );

    return NextResponse.json({
      success: true,
      message: "Tasks fetched successfully",
      data,
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks.",
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (
      !body.title ||
      !body.date ||
      !body.startTime ||
      !body.endTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    const startMinutes = timeToMinutes(body.startTime);
    const endMinutes = timeToMinutes(body.endTime);

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        {
          success: false,
          message: "End time must be after start time.",
        },
        { status: 400 }
      );
    }

    const dateKey = body.date.substring(0, 10);
    const repeat = normalizeRepeat(body.repeat);

    if (
      repeat.enabled &&
      repeat.until &&
      repeat.until < dateKey
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Repeat until date cannot be before task date.",
        },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title: body.title,
      description: body.description ?? "",

      date: parseDateKey(dateKey),
      dateKey,

      startTime: body.startTime,
      endTime: body.endTime,

      startMinutes,
      endMinutes,

      priority: body.priority ?? "medium",
      status: body.status ?? "pending",
      color: body.color ?? "#3B82F6",

      repeat,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully.",
        data: normalizeTask(task.toObject()),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Task creation failed.",
      },
      { status: 500 }
    );
  }
}