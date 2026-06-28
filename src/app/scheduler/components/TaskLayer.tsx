"use client";

import { CalendarEvent } from "../types/task";
import TaskEvent from "./TaskEvent";

export default function TaskLayer({
  events,
}: {
  events: CalendarEvent[];
}) {
  return (
    <div className="absolute inset-0 z-10">
      {events.map((event) => (
        <TaskEvent
          key={event.task.id}
          event={event}
        />
      ))}
    </div>
  );
}