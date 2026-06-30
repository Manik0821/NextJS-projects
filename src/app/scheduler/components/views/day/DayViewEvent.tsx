"use client";

import { CalendarEvent } from "../../../types/task";
import { useScheduler } from "../../../provider";
import { getEventCardVariant } from "./dayView.helpers";
import styles from "./dayView.module.css";

interface DayViewEventProps {
  event: CalendarEvent;
}

export default function DayViewEvent({ event }: DayViewEventProps) {
  const { openDetails } = useScheduler();
  const variant = getEventCardVariant(event.height);
  const timeRange = `${event.task.startTime} - ${event.task.endTime}`;

  return (
    <button
      type="button"
      onClick={() => openDetails(event.task)}
      className={`${styles.eventCard} ${
        variant === "tiny"
          ? styles.eventCardTiny
          : variant === "compact"
            ? styles.eventCardCompact
            : styles.eventCardStandard
      }`}
      style={{
        top: `${event.top}px`,
        left: `${event.left}%`,
        width: `calc(${event.width}% - 4px)`,
        height: `${event.height}px`,
        backgroundColor: event.task.color || "#3b82f6",
      }}
    >
      {variant === "tiny" ? (
        <div className={styles.eventContentTiny}>
          <span>
            {event.task.title} {timeRange}
          </span>
        </div>
      ) : variant === "compact" ? (
        <div className={styles.eventContentCompact}>
          <span className={styles.eventTitle}>{event.task.title}</span>
          <span className={styles.eventTime}>{timeRange}</span>
        </div>
      ) : (
        <>
          <div className={styles.eventTitle}>{event.task.title}</div>

          {event.height > 60 && event.task.description ? (
            <>
              <div className={styles.eventDescription}>
                {event.task.description}
              </div>
              <div className={styles.eventTime}>{timeRange}</div>
            </>
          ) : (
            <div className={styles.eventTime}>{timeRange}</div>
          )}
        </>
      )}
    </button>
  );
}
