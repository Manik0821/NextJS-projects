// src/app/scheduler/components/CurrentTimeIndicator.tsx
"use client";

import { useCurrentTime } from "../hooks/useCurrentTime";

interface CurrentTimeIndicatorProps {
  selectedDate: Date;
}

export default function CurrentTimeIndicator({
  selectedDate,
}: CurrentTimeIndicatorProps) {
  const { top } = useCurrentTime();

  const today = new Date();
  const isToday = today.toDateString() === selectedDate.toDateString();

  if (!isToday) {
    return null;
  }

  // SCALE CONVERSION RULE:
  // If your hook evaluates positions using 60px/hour rules, we scale it x2 here.
  // If your hook already handles the dynamic 120px scale natively, use raw: top
  const scaledTopPosition = top * 2;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none w-full transition-all duration-300 ease-out"
      style={{
        top: `${scaledTopPosition}px`,
      }}
    >
      {/* Centered target point anchor dot */}
      <div className="absolute -left-[5px] -top-[4px] h-[10px] w-[10px] rounded-full bg-red-500 shadow-xs ring-2 ring-white" />

      {/* Real-time horizontal breakdown line */}
      <div className="w-full border-t-2 border-red-500 opacity-90" />
    </div>
  );
}
