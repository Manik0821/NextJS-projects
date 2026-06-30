// src/app/scheduler/components/TimeColumn.tsx
"use client";

import {
  HOUR_HEIGHT,
  HOURS_PER_DAY,
} from "../../constants/scheduler";

export default function TimeColumn() {
  return (
    <div
      className="sticky left-0 z-30 bg-white border-r border-slate-200 select-none shrink-0"
      style={{
        width: "64px",
      }}
    >
      <div
        className="w-full relative"
        style={{ height: `${HOURS_PER_DAY * HOUR_HEIGHT}px` }}
      >
        {Array.from({ length: HOURS_PER_DAY }).map((_, hour) => {
          // FIXED: Converts 0-23 hours into a elegant 12-hour clock array representation (e.g. 9 AM, 1 PM)
          const isAm = hour < 12;
          const displayHour = hour % 12 === 0 ? 12 : hour % 12;
          const amPmSuffix = isAm ? "AM" : "PM";

          return (
            <div
              key={hour}
              className="absolute left-0 right-0"
              style={{
                top: `${hour * HOUR_HEIGHT}px`,
                height: `${HOUR_HEIGHT}px`,
              }}
            >
              {/* 
                FIXED: Hides the very first label (0 hour / 12 AM) 
                to cleanly avoid messy layout bleeding into your sticky header row grid.
              */}
              {hour > 0 && (
                <span className="absolute right-2.5 -top-2 text-[9px] font-extrabold tracking-wide text-slate-400 font-mono">
                  {displayHour} {amPmSuffix}
                </span>
              )}

              {/* Refined clean interior guide anchor line matching the companion timeline grid */}
              <div className="w-full border-t border-slate-100/70" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
