"use client";

import { useEffect, useMemo, useRef } from "react";

import { Task } from "../../../types/task";
import { getWeekDates } from "../../../utils/week";
import { useScheduler } from "../../../provider";
import { formatLocalDate, getHourLabel, getWeekViewEvents } from "./weekView.helpers";
import WeekViewEvent from "./WeekViewEvent";
import styles from "./weekView.module.css";

interface Props {
  date: Date;
  tasks: Task[];
}

export default function WeekView({ date, tasks }: Props) {
  const week = useMemo(() => getWeekDates(date), [date]);

  const { changeDate, changeView } = useScheduler();

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedColumnRef = useRef<HTMLDivElement>(null);
  const selectedDateKey = formatLocalDate(date);

  const handleDayClick = (day: Date) => {
    changeDate(day);
    changeView("day");
  };

  const selectedDayEvents = useMemo(() => {
    return getWeekViewEvents(tasks, selectedDateKey);
  }, [tasks, selectedDateKey]);

  useEffect(() => {
    const container = containerRef.current;
    const selectedColumn = selectedColumnRef.current;

    if (!container || !selectedColumn) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const columnRect = selectedColumn.getBoundingClientRect();
    const currentScrollLeft = container.scrollLeft;

    const columnLeftInsideContainer =
      columnRect.left - containerRect.left + currentScrollLeft;

    const targetScrollLeft =
      columnLeftInsideContainer - container.clientWidth / 2 + selectedColumn.clientWidth / 2;

    const firstTaskTop =
      selectedDayEvents.length > 0
        ? Math.max(
            Math.min(...selectedDayEvents.map((event) => event.top)) - 120,
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
    <div ref={containerRef} className={styles.weekViewContainer}>
      {week.map((day, index) => {
        const dayKey = formatLocalDate(day);
        const events = getWeekViewEvents(tasks, dayKey);
        const isSelected = dayKey === selectedDateKey;

        return (
          <div
            key={dayKey}
            ref={isSelected ? selectedColumnRef : undefined}
            role="button"
            tabIndex={0}
            onClick={() => handleDayClick(day)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleDayClick(day);
              }
            }}
            className={`${styles.weekColumn} ${index === 0 ? styles.weekColumnFirst : ""} ${isSelected ? styles.weekColumnSelected : ""}`}
          >
            <div className={styles.weekStickyHeader}>
              <div className={styles.weekDayLabel}>
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div className={styles.weekDayNumber}>{day.getDate()}</div>
            </div>

            <div className={styles.weekGridCanvas}>
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className={styles.weekHourSlot}>
                  <span className={styles.weekHourLabel}>{getHourLabel(hour)}</span>
                </div>
              ))}

              {events.map((event) => (
                <WeekViewEvent key={event.task.id ?? event.task._id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}