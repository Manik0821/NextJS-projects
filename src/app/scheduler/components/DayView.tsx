"use client";

import { useEffect, useMemo, useRef } from "react";

import { Task } from "../types/task";
import { buildCalendarEvents } from "../utils/taskLayout";
import { formatDate } from "../utils/date";
import { useScheduler } from "../provider";

import "./scheduler.module.css";

interface DayViewProps {
  date: Date;
  tasks: Task[];
}

function getTaskDateKey(task: Task) {
  return task.dateKey ?? task.date.substring(0, 10);
}

export default function DayView({
  date,
  tasks,
}: DayViewProps) {
  const { openDetails } = useScheduler();

  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedDate = formatDate(date);

  const dayTasks = useMemo(() => {
    return tasks.filter(
      (task) => getTaskDateKey(task) === selectedDate
    );
  }, [tasks, selectedDate]);

  const events = useMemo(() => {
    return buildCalendarEvents(dayTasks);
  }, [dayTasks]);

  useEffect(() => {
    if (!scrollRef.current) return;

    if (events.length === 0) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const firstEventTop = Math.min(
      ...events.map((event) => event.top)
    );

    scrollRef.current.scrollTo({
      top: Math.max(firstEventTop - 120, 0),
      behavior: "smooth",
    });
  }, [selectedDate, events]);

  return (
    <div
      ref={scrollRef}
      className="flex h-full w-full overflow-auto bg-slate-50"
    >
      <div className="w-16 shrink-0 border-r border-slate-200 bg-white select-none">
        <div className="h-[2880px]">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={hour}
              className="flex h-[120px] items-start justify-end pr-2 pt-2 text-[10px] font-bold tracking-wider text-slate-400"
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-w-0 flex-1 bg-white">
        <div className="relative h-[2880px] w-full">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={hour}
              className="h-[120px] border-b border-slate-100"
            />
          ))}

          {events.map((event) => (
            <button
              key={event.task.id ?? event.task._id}
              type="button"
              onClick={() => openDetails(event.task)}
              className="group absolute overflow-hidden rounded-lg border border-black/5 p-2 text-left text-white shadow-sm transition-all hover:brightness-95 hover:shadow-md"
              style={{
                top: `${event.top}px`,
                left: `${event.left}%`,
                width: `calc(${event.width}% - 4px)`,
                height: `${event.height}px`,
                backgroundColor:
                  event.task.color || "#3b82f6",
              }}
            >
              <div className="truncate text-xs font-bold leading-tight group-hover:underline">
                {event.task.title}
              </div>

              {event.height > 45 && (
                <div className="mt-0.5 truncate text-[10px] font-medium opacity-85">
                  {event.task.startTime} - {event.task.endTime}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}