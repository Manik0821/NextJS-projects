"use client";

import { useEffect, useMemo, useRef } from "react";

import { Task } from "../../../types/task";
import { buildCalendarEvents } from "../../../utils/taskLayout";
import { formatDate } from "../../../utils/date";
import { getTaskDateKey } from "./dayView.helpers";
import DayViewEvent from "./DayViewEvent";
import styles from "./dayView.module.css";

interface DayViewProps {
  date: Date;
  tasks: Task[];
}

export default function DayView({
  date,
  tasks,
}: DayViewProps) {
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
    <div ref={scrollRef} className={styles.dayViewContainer}>
      <div className={styles.timeColumn}>
        <div className={styles.timeColumnBody}>
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className={styles.timeLabel}>
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timelineColumn}>
        <div className={styles.timelineCanvas}>
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className={styles.hourSlot} />
          ))}

          {events.map((event) => (
            <DayViewEvent key={event.task.id ?? event.task._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}