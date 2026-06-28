// src/app/scheduler/utils/taskLayout.ts

import { CalendarEvent, Task } from "../types/task";
import { getStartMinutes, getEndMinutes } from "./time";

const TOP_PIXELS_PER_MINUTE = 2;
const HEIGHT_PIXELS_PER_MINUTE = 1;

function overlaps(a: Task, b: Task) {
  return (
    getStartMinutes(a) < getEndMinutes(b) &&
    getEndMinutes(a) > getStartMinutes(b)
  );
}

export function buildCalendarEvents(
  tasks: Task[]
): CalendarEvent[] {
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

      // Correct vertical position
      top: start * TOP_PIXELS_PER_MINUTE,

      // Smaller event height
      height: Math.max(
        (end - start) * HEIGHT_PIXELS_PER_MINUTE,
        20
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