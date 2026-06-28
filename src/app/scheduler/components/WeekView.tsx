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
            className={`${styles.weekColumn} ${
              index === 0
                ? styles.weekColumnFirst
                : ""
            } ${
              isSelected
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
                  key={
                    event.task.id ??
                    event.task._id
                  }
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