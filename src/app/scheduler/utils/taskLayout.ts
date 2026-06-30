// src/app/scheduler/utils/taskLayout.ts

import { CalendarEvent, Task } from "../types/task";
import { getStartMinutes, getEndMinutes } from "./time";

interface BuildCalendarEventsOptions {
  pixelsPerMinute?: number;
}

function overlaps(a: Task, b: Task) {
  return (
    getStartMinutes(a) < getEndMinutes(b) &&
    getEndMinutes(a) > getStartMinutes(b)
  );
}

export function buildCalendarEvents(
  tasks: Task[],
  options: BuildCalendarEventsOptions = {}
): CalendarEvent[] {
  const pixelsPerMinute = options.pixelsPerMinute ?? 1;
  const sorted = [...tasks].sort((a, b) => {
    const diff =
      getStartMinutes(a) -
      getStartMinutes(b);

    if (diff !== 0) return diff;

    return (
      getEndMinutes(a) -
      getEndMinutes(b)
    );
  });

  const columns: Task[][] = [];
  const events: CalendarEvent[] = [];

  for (const task of sorted) {
    let column = 0;

    while (true) {
      if (!columns[column]) {
        columns[column] = [task];
        break;
      }

      const collision = columns[column].some(
        (existing) => overlaps(existing, task)
      );

      if (!collision) {
        columns[column].push(task);
        break;
      }

      column++;
    }

    const start = getStartMinutes(task);
    const end = getEndMinutes(task);

    events.push({
      task,

      top: start * pixelsPerMinute,
      height: Math.max(
        (end - start) * pixelsPerMinute,
        10
      ),

      column,
      totalColumns: 1,

      left: 0,
      width: 100,

      overlaps: [],
    });
  }

  for (const event of events) {
    const group = events.filter((other) =>
      overlaps(event.task, other.task)
    );

    const totalColumns =
      Math.max(
        ...group.map((e) => e.column),
        event.column
      ) + 1;

    event.totalColumns = totalColumns;
    event.width = 100 / totalColumns;
    event.left = event.column * event.width;

    event.overlaps = group
      .map((e) => e.task.id)
      .filter(
        (id): id is string =>
          id !== undefined &&
          id !== event.task.id
      );
  }

  return events;
}