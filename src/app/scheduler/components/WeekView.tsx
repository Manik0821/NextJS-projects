"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Task } from "../types/task";
import { buildCalendarEvents } from "../utils/taskLayout";
import { getWeekDates } from "../utils/week";
import { useScheduler } from "../provider";
import styles from "./scheduler.module.css";

interface Props {
  date: Date;
  tasks: Task[];
}

function formatLocalDate(value: Date | string) {
  if (typeof value === "string") {
    return value.substring(0, 10);
  }

  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    value.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTaskDateKey(task: Task) {
  return (
    task.dateKey ??
    task.date.substring(0, 10)
  );
}

export default function WeekView({
  date,
  tasks,
}: Props) {
  const week = useMemo(
    () => getWeekDates(date),
    [date]
  );

  const {
    openDetails,
    changeDate,
    changeView,
  } = useScheduler();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selectedColumnRef =
    useRef<HTMLDivElement>(null);

  const selectedDateKey =
    formatLocalDate(date);

  const handleDayClick = (day: Date) => {
    changeDate(day);
    changeView("day");
  };

  const selectedDayEvents = useMemo(() => {
    const selectedDayTasks = tasks.filter(
      (task) =>
        getTaskDateKey(task) === selectedDateKey
    );

    return buildCalendarEvents(
      selectedDayTasks
    );
  }, [tasks, selectedDateKey]);

  useEffect(() => {
    const container = containerRef.current;
    const selectedColumn =
      selectedColumnRef.current;

    if (!container || !selectedColumn) {
      return;
    }

    const containerRect =
      container.getBoundingClientRect();

    const columnRect =
      selectedColumn.getBoundingClientRect();

    const currentScrollLeft =
      container.scrollLeft;

    const columnLeftInsideContainer =
      columnRect.left -
      containerRect.left +
      currentScrollLeft;

    const targetScrollLeft =
      columnLeftInsideContainer -
      container.clientWidth / 2 +
      selectedColumn.clientWidth / 2;

    const firstTaskTop =
      selectedDayEvents.length > 0
        ? Math.max(
          Math.min(
            ...selectedDayEvents.map(
              (event) => event.top
            )
          ) - 120,
          0
        )
        : 0;

    container.scrollTo({
      left: Math.max(targetScrollLeft, 0),
      top: firstTaskTop,
      behavior: "smooth",
    });
  }, [selectedDateKey, selectedDayEvents]);

  return (
    <div
      ref={containerRef}
      className={`${styles.weekContainer} overflow-auto`}
    >
      {week.map((day, index) => {
        const dayKey = formatLocalDate(day);

        const dayTasks = tasks.filter(
          (task) =>
            getTaskDateKey(task) === dayKey
        );

        const events =
          buildCalendarEvents(dayTasks);

        const isSelected =
          dayKey === selectedDateKey;

        return (
          <div
            key={dayKey}
            ref={
              isSelected
                ? selectedColumnRef
                : undefined
            }
            role="button"
            tabIndex={0}
            onClick={() =>
              handleDayClick(day)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                e.preventDefault();
                handleDayClick(day);
              }
            }}
            className={`${styles.weekColumn} ${index === 0
                ? styles.weekColumnFirst
                : ""
              } ${isSelected
                ? styles.weekColumnSelected ?? ""
                : ""
              }`}
          >
            <div
              className={
                styles.weekStickyHeader
              }
            >
              <div
                className={
                  styles.weekDayLabel
                }
              >
                {day.toLocaleDateString(
                  undefined,
                  {
                    weekday: "short",
                  }
                )}
              </div>

              <div
                className={
                  styles.weekDayNumber
                }
              >
                {day.getDate()}
              </div>
            </div>

            <div
              className={
                styles.weekGridCanvas
              }
            >
              {Array.from({
                length: 24,
              }).map((_, hour) => (
                <div
                  key={hour}
                  className={
                    styles.weekHourSlot
                  }
                >
                  <span
                    className={
                      styles.weekHourLabel
                    }
                  >
                    {hour === 0
                      ? "12 AM"
                      : hour > 12
                        ? `${hour - 12} PM`
                        : `${hour} ${hour === 12
                          ? "PM"
                          : "AM"
                        }`}
                  </span>
                </div>
              ))}

              {events.map((event) => (
                <button
                  key={
                    event.task.id ??
                    event.task._id
                  }
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetails(event.task);
                  }}
                  className={`${styles.weekTaskCard} ${event.height < 30 ? "p-0" : "p-2"}`}
                  style={{
                    top: `${event.top}px`,
                    left: `${event.left}%`,
                    width: `calc(${event.width}% - 4px)`,
                    height: `${event.height}px`,
                    backgroundColor:
                      event.task.color,
                  }}
                >
                  {event.height < 30 ? (
                    <div className="flex h-full w-full items-center justify-center overflow-visible text-[8px] font-bold leading-none tracking-wide text-white">
                      <span className="truncate">
                        {event.task.title}
                      </span>
                    </div>
                  ) : event.height < 45 ? (
                    <div className="flex h-full w-full items-center gap-1 overflow-hidden text-[9px] font-semibold leading-none tracking-wide text-white">
                      <span className="min-w-0 flex-1 truncate">
                        {event.task.title}
                      </span>
                      {/* <span className="shrink-0 whitespace-nowrap">
                        {event.task.startTime} - {event.task.endTime}
                      </span> */}
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col justify-start overflow-hidden">
                      <div className={styles.weekTaskTitle}>
                        {event.task.title}
                      </div>

                      {event.height > 60 && event.task.description ? (
                        <>
                        <div className="mt-0.5 truncate text-[10px] font-medium text-slate-200">
                          {event.task.description}
                        </div>
                        <div className={styles.weekTaskTime}>
                          {event.task.startTime} - {event.task.endTime}
                        </div>
                        </>
                      ) : (
                        <div className={styles.weekTaskTime}>
                          {event.task.startTime} - {event.task.endTime}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}