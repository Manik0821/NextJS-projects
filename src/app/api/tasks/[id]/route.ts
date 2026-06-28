import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Task from "@/db/models/Task";
import { connectDB } from "@/lib/DB/mongodb";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

interface RepeatOptions {
  enabled: boolean;
  frequency: RepeatFrequency;
  interval: number;
  until: string;
}

/* ----------------------------------------
   Utils
---------------------------------------- */

function timeToMinutes(time: string) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateString: string) {
  const clean = dateString.substring(0, 10);

  const [year, month, day] = clean
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0
  );
}

function normalizeRepeat(
  repeat?: Partial<RepeatOptions>
): RepeatOptions {
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
      repeat.frequency &&
      repeat.frequency !== "none"
        ? repeat.frequency
        : "daily",
    interval: Math.max(
      Number(repeat.interval) || 1,
      1
    ),
    until: repeat.until ?? "",
  };
}

/* ----------------------------------------
   GET /api/tasks/:id
---------------------------------------- */

export async function GET(
    request: NextRequest,
    { params }: RouteContext
  ) {
    try {
      await connectDB();
  
      const { id } = await params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid task id.",
          },
          {
            status: 400,
          }
        );
      }
  
      const task = await Task.findById(id);
  
      if (!task) {
        return NextResponse.json(
          {
            success: false,
            message: "Task not found.",
          },
          {
            status: 404,
          }
        );
      }
  
      console.log("========== TASK ==========");
      console.log("_id:", task._id.toString());
      console.log("title:", task.title);
      console.log("dateKey:", task.dateKey);
      console.log("repeat:", task.repeat);
      console.log("excludedDates:", task.excludedDates);
      console.log("==========================");
  
      return NextResponse.json(
        {
          success: true,
          data: task,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(
        "GET /api/tasks/:id error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message: "Unable to fetch task.",
        },
        {
          status: 500,
        }
      );
    }
  }

/* ----------------------------------------
   PATCH /api/tasks/:id
---------------------------------------- */

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid task id.",
        },
        {
          status: 400,
        }
      );
    }

    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const update: Record<string, any> = {
      ...body,
    };

    if (body.date) {
      const parsedDate = parseDateKey(body.date);

      update.date = parsedDate;
      update.dateKey = formatDateKey(parsedDate);
    }

    const startTime =
      body.startTime ?? existingTask.startTime;

    const endTime =
      body.endTime ?? existingTask.endTime;

    const startMinutes =
      timeToMinutes(startTime);

    const endMinutes =
      timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End time must be after start time.",
        },
        {
          status: 400,
        }
      );
    }

    update.startMinutes = startMinutes;
    update.endMinutes = endMinutes;

    if (body.repeat !== undefined) {
      const repeat = normalizeRepeat(
        body.repeat
      );

      const taskDate =
        update.date ?? existingTask.date;

      if (
        repeat.enabled &&
        repeat.until &&
        parseDateKey(repeat.until) <
          parseDateKey(formatDateKey(taskDate))
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Repeat until date cannot be before task date.",
          },
          {
            status: 400,
          }
        );
      }

      update.repeat = repeat;
    }

    const updatedTask =
      await Task.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Task updated successfully.",
        data: updatedTask,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PATCH /api/tasks/:id error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update task.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ----------------------------------------
   DELETE /api/tasks/:id
---------------------------------------- */

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
  ) {
    try {
      await connectDB();
  
      const { id } = await params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid task id.",
          },
          { status: 400 }
        );
      }
  
      const { searchParams } = new URL(request.url);
  
      const scope =
        searchParams.get("scope") ?? "series";
  
      const occurrenceDate =
        searchParams.get("occurrenceDate");
  
      const objectId =
        new mongoose.Types.ObjectId(id);
  
      if (
        scope === "occurrence" &&
        occurrenceDate
      ) {
        const dateKey =
          occurrenceDate.substring(0, 10);
  
        const result =
          await Task.collection.updateOne(
            {
              _id: objectId,
            },
            {
              $addToSet: {
                excludedDates: dateKey,
              },
            }
          );
  
        if (result.matchedCount === 0) {
          return NextResponse.json(
            {
              success: false,
              message: "Task not found.",
            },
            { status: 404 }
          );
        }
  
        const updatedTask =
          await Task.collection.findOne({
            _id: objectId,
          });
  
        return NextResponse.json(
          {
            success: true,
            message:
              "Occurrence deleted successfully.",
            deletedOccurrence: dateKey,
            excludedDates:
              updatedTask?.excludedDates ?? [],
          },
          { status: 200 }
        );
      }
  
      const result =
        await Task.collection.deleteOne({
          _id: objectId,
        });
  
      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Task not found.",
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          success: true,
          message:
            "Task series deleted successfully.",
          deletedId: id,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(
        "DELETE /api/tasks/:id error:",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete task.",
        },
        { status: 500 }
      );
    }
  }