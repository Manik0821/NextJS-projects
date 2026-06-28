// src/app/scheduler/components/TaskEvent.tsx
"use client";

import { CalendarEvent } from "../types/task";
import { useScheduler } from "../provider";

interface TaskEventProps {
  event: CalendarEvent;
}

export default function TaskEvent({
  event,
}: TaskEventProps) {
  const { openDetails } = useScheduler();
  const { task } = event;

  return (
    <button
      type="button"
      onClick={() => openDetails(task)}
      className="group absolute rounded-lg border border-black/5 p-2 text-left text-white shadow-sm transition-all duration-200 hover:brightness-95 hover:shadow-md select-none overflow-hidden"
      style={{
        // FIXED: Appended explicit 'px' string literals so inline CSS properties render correctly
        top: `${event.top}px`,
        height: `${event.height}px`,
        width: `calc(${event.width}% - 6px)`,
        left: `calc(${event.left}% + 3px)`,
        backgroundColor: task.color || "#3b82f6",
      }}
    >
      {/* Event Title */}
      <div className="truncate text-xs font-bold leading-tight group-hover:underline">
        {task.title}
      </div>

      {/* FIXED: Time details will only render if the task element is tall enough to prevent text clips */}
      {event.height > 45 && (
        <div className="mt-0.5 truncate text-[10px] font-medium opacity-85">
          {task.startTime} - {task.endTime}
        </div>
      )}
    </button>
  );
}
