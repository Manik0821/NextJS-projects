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
        <div className="h-[1440px]">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={hour}
              className="flex h-[60px] items-start justify-end pr-2 pt-2 text-[12px] font-bold tracking-[0.16em] text-slate-400"
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-w-0 flex-1 bg-white">
        <div className="relative h-[1440px] w-full">
          {Array.from({ length: 24 }).map((_, hour) => (
            <div
              key={hour}
              className="h-[60px] border-b border-slate-100"
            />
          ))}

          {events.map((event) => (
            <button
              key={event.task.id ?? event.task._id}
              type="button"
              onClick={() => openDetails(event.task)}
              className={`group absolute overflow-hidden rounded-lg border border-black/5 text-left text-white shadow-sm transition-all hover:brightness-95 hover:shadow-md ${event.height < 30 ? "p-0" : "p-2"}`}
              style={{
                top: `${event.top}px`,
                left: `${event.left}%`,
                width: `calc(${event.width}% - 4px)`,
                height: `${event.height}px`,
                backgroundColor:
                  event.task.color || "#3b82f6",
              }}
            >
              {event.height < 30 ? (
                <div className="flex h-full w-full items-center justify-center overflow-visible text-[8px] font-bold leading-none tracking-wide text-white group-hover:underline">
                  <span className=" px-0.5">
                    {event.task.title} {event.task.startTime} - {event.task.endTime}
                  </span>
                </div>
              ) : event.height < 45 ? (
                <div className="flex h-full w-full items-center gap-1 overflow-hidden px-0.5 text-[11px] font-semibold leading-none tracking-wide text-white group-hover:underline">
                  <span className="min-w-0 flex-1 truncate">
                    {event.task.title}
                  </span>
                  <span className="shrink-0 whitespace-nowrap">
                    {event.task.startTime} - {event.task.endTime}
                  </span>
                </div>
              ) : (
                <>
                  <div className="truncate text-[12px] font-bold leading-[1.1] tracking-wide text-white group-hover:underline">
                    {event.task.title}
                  </div>

                  {event.height > 60 && event.task.description ? (
                    <>
                    <div className="mt-0.5 truncate text-[11px] font-medium text-slate-200">
                      {event.task.description}
                    </div>
                    <div className="truncate text-[12px] font-medium opacity-100">
                      {event.task.startTime} - {event.task.endTime}
                    </div>
                    </>
                  ) : (
                    <div className="truncate text-[12px] font-medium opacity-100">
                      {event.task.startTime} - {event.task.endTime}
                    </div>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}