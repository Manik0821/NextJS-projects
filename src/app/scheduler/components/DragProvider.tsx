"use client";

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

interface DropProviderProps {
  children: React.ReactNode;

  updateTask: (
    id: string,
    data: any
  ) => Promise<void>;
}

function clampMinutes(minutes: number) {
  return Math.max(
    0,
    Math.min(1439, minutes)
  );
}

function minutesToTime(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hrs).padStart(
    2,
    "0"
  )}:${String(mins).padStart(2, "0")}`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DropProvider({
  children,
  updateTask,
}: DropProviderProps) {
  async function onDragEnd(
    event: DragEndEvent
  ) {
    const task =
      event.active.data.current?.task;

    const over = event.over;

    if (!task || !over) return;

    const droppedDate =
      over.data.current?.date;

    // 1 pixel = 1 minute
    const deltaMinutes = Math.round(
      event.delta.y
    );

    const duration =
      task.endMinutes -
      task.startMinutes;

    let start =
      task.startMinutes + deltaMinutes;

    start = clampMinutes(start);

    let end = start + duration;

    if (end > 1440) {
      end = 1440;
      start = end - duration;
    }

    const payload: any = {
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),

      startMinutes: start,
      endMinutes: end,
    };

    if (droppedDate) {
      payload.date = formatDate(
        new Date(droppedDate)
      );
    }

    await updateTask(task.id, payload);
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      {children}
    </DndContext>
  );
}