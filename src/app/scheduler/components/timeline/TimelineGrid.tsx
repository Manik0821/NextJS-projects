// src/app/scheduler/components/TimelineGrid.tsx
"use client";

import {
  HOUR_HEIGHT,
  HOURS_PER_DAY,
} from "../../constants/scheduler";

export default function TimelineGrid() {
  const totalCanvasHeight = HOURS_PER_DAY * HOUR_HEIGHT;

  return (
    <div className="flex-1 bg-white relative overflow-hidden select-none">
      {/* 
        CRITICAL ISOLATION CANVAS: 
        Ensures the background markings perfectly mirror your calculated mathematical positions
      */}
      <div
        className="w-full relative"
        style={{ height: `${totalCanvasHeight}px` }}
      >
        {Array.from({ length: HOURS_PER_DAY }).map((_, hour) => {
          const currentTopOffset = hour * HOUR_HEIGHT;

          return (
            <div
              key={hour}
              className="absolute left-0 right-0"
              style={{
                // FIXED: Direct pixel positioning stops border pixel accumulation drifts
                top: `${currentTopOffset}px`,
                height: `${HOUR_HEIGHT}px`,
              }}
            >
              {/* Solid Horizontal Hour Rule Guideline */}
              <div className="w-full border-t border-slate-200/80" />

              {/* 15-Minute Quarter Dash Marker Line */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-slate-100/60"
                style={{ top: "25%" }}
              />

              {/* 30-Minute Half-Hour Dash Marker Line */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-slate-100/90"
                style={{ top: "50%" }}
              />

              {/* 45-Minute Quarter Dash Marker Line */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-slate-100/60"
                style={{ top: "75%" }}
              />
            </div>
          );
        })}

        {/* Final trailing row line bounding the bottom border of the 23rd hour slot */}
        <div
          className="absolute left-0 right-0 border-t border-slate-200/80"
          style={{ top: `${totalCanvasHeight - 1}px` }}
        />
      </div>
    </div>
  );
}
