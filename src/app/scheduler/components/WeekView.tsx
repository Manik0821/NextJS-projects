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

export default function WeekView({
  date,
  tasks,
}: Props) {
  const week = getWeekDates(date);

  const {
    openDetails,
    changeDate,
    changeView,
  } = useScheduler();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selectedDayRef =
    useRef<HTMLDivElement>(null);

  const handleDayClick = (day: Date) => {
    changeDate(day);
    changeView("day");
  };

  const selectedKey =
    formatLocalDate(date);

  const firstTaskTop = useMemo(() => {
    const dayTasks = tasks.filter(
      (task) =>
        formatLocalDate(task.date) ===
        selectedKey
    );

    if (dayTasks.length === 0) {
      return 0;
    }

    const events =
      buildCalendarEvents(dayTasks);

    return Math.max(
      Math.min(
        ...events.map((e) => e.top)
      ) - 120,
      0
    );
  }, [tasks, selectedKey]);

  useEffect(() => {
    if (
      containerRef.current &&
      selectedDayRef.current
    ) {
      selectedDayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });

      containerRef.current.scrollTo({
        top: firstTaskTop,
        behavior: "smooth",
      });
    }
  }, [selectedKey, firstTaskTop]);

  return (
    <div
      ref={containerRef}
      className={`${styles.weekContainer} overflow-auto`}
    >
      {week.map((day, index) => {
        const dayKey =
          formatLocalDate(day);

        const dayTasks = tasks.filter(
          (task) =>
            formatLocalDate(task.date) ===
            dayKey
        );

        const events =
          buildCalendarEvents(dayTasks);

        const isSelected =
          dayKey === selectedKey;

        return (
          <div
            key={day.toISOString()}
            ref={
              isSelected
                ? selectedDayRef
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
            className={`${styles.weekColumn} ${
              index === 0
                ? styles.weekColumnFirst
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
                      : `${hour} ${
                          hour === 12
                            ? "PM"
                            : "AM"
                        }`}
                  </span>
                </div>
              ))}

              {events.map((event) => (
                <button
                  key={event.task.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetails(event.task);
                  }}
                  className={
                    styles.weekTaskCard
                  }
                  style={{
                    top: `${event.top}px`,
                    left: `${event.left}%`,
                    width: `calc(${event.width}% - 4px)`,
                    height: `${event.height}px`,
                    backgroundColor:
                      event.task.color,
                  }}
                >
                  <div
                    className={
                      styles.weekTaskOverlay
                    }
                  />

                  <div
                    className={
                      styles.weekTaskAccent
                    }
                  />

                  <div
                    className={
                      styles.weekTaskContent
                    }
                  >
                    <div
                      className={
                        styles.weekTaskTitle
                      }
                    >
                      {event.task.title}
                    </div>

                    <div
                      className={
                        styles.weekTaskTime
                      }
                    >
                      {event.task.startTime} -{" "}
                      {event.task.endTime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}