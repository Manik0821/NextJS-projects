"use client";

import { useScheduler } from "../../../provider";
import { CalendarEvent } from "../../../types/task";
import { getEventCardVariant } from "./weekView.helpers";
import styles from "./weekView.module.css";

interface WeekViewEventProps {
  event: CalendarEvent;
}

export default function WeekViewEvent({ event }: WeekViewEventProps) {
  const { openDetails } = useScheduler();
  const variant = getEventCardVariant(event.height);
  const timeRange = `${event.task.startTime} - ${event.task.endTime}`;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openDetails(event.task);
      }}
      className={`${styles.weekTaskCard} ${
        variant === "tiny"
          ? styles.weekTaskCardTiny
          : variant === "compact"
            ? styles.weekTaskCardCompact
            : styles.weekTaskCardStandard
      }`}
      style={{
        top: `${event.top}px`,
        left: `${event.left}%`,
        width: `calc(${event.width}% - 4px)`,
        height: `${event.height}px`,
        backgroundColor: event.task.color,
      }}
    >
      {variant === "tiny" ? (
        <div className={styles.weekTaskContentTiny}>
          <span>{event.task.title}</span>
        </div>
      ) : variant === "compact" ? (
        <div className={styles.weekTaskContentCompact}>
          <span className={styles.weekTaskTitle}>{event.task.title}</span>
          <span className={styles.weekTaskTime}>{timeRange}</span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-start overflow-hidden">
          <div className={styles.weekTaskTitle}>{event.task.title}</div>
          {event.height > 60 && event.task.description ? (
            <>
              <div className={styles.weekTaskDescription}>{event.task.description}</div>
              <div className={styles.weekTaskTime}>{timeRange}</div>
            </>
          ) : (
            <div className={styles.weekTaskTime}>{timeRange}</div>
          )}
        </div>
      )}
    </button>
  );
}
