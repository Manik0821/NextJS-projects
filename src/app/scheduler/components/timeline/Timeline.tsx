"use client";

import { Task } from "../../types/task";

import TimeColumn from "./TimeColumn";
import TimelineGrid from "./TimelineGrid";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import TaskLayer from "./TaskLayer";

import { buildCalendarEvents } from "../../utils/taskLayout";

import { DAY_HEIGHT } from "../../constants/scheduler";

interface TimelineProps {
  tasks: Task[];
  loading: boolean;
  selectedDate: Date;
}

export default function Timeline({
  tasks,
  loading,
  selectedDate,
}: TimelineProps) {
  const events = buildCalendarEvents(tasks);

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="flex min-w-[900px]">
        <TimeColumn />

        <div
          className="relative flex-1"
          style={{ height: DAY_HEIGHT }}
        >
          <TimelineGrid />

          <CurrentTimeIndicator
            selectedDate={selectedDate}
          />

          {!loading && (
            <TaskLayer events={events} />
          )}
        </div>
      </div>
    </div>
  );
}