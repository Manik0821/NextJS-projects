"use client";

import { useEffect, useState, useTransition } from "react";
import { TaskPriority, TaskStatus } from "../../types/task";
import { formatDate } from "../../utils/date";

type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

interface RepeatOptions {
  enabled: boolean;
  frequency: RepeatFrequency;
  interval: number;
  until: string;
}

interface AddTaskDialogProps {
  open: boolean;
  selectedDate: Date;
  onClose: () => void;

  onCreateTask: (task: {
    title: string;
    description: string;
    date: string;

    startTime: string;
    endTime: string;

    priority: TaskPriority;
    status: TaskStatus;

    color: string;

    repeat: RepeatOptions;
  }) => Promise<void>;
}

export default function AddTaskDialog({
  open,
  selectedDate,
  onClose,
  onCreateTask,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [startTime, setStartTime] =
    useState("09:00");

  const [endTime, setEndTime] =
    useState("10:00");

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [status, setStatus] =
    useState<TaskStatus>("pending");

  const [color, setColor] =
    useState("#3B82F6");

  const [repeat, setRepeat] =
    useState<RepeatOptions>({
      enabled: false,
      frequency: "none",
      interval: 1,
      until: "",
    });

  const [error, setError] =
    useState<string | null>(null);

  const [isPending, startTransition] =
    useTransition();

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
      setPriority("medium");
      setStatus("pending");
      setColor("#3B82F6");

      setRepeat({
        enabled: false,
        frequency: "none",
        interval: 1,
        until: "",
      });

      setError(null);
    }
  }, [open]);

  if (!open) return null;

  function submit() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (startTime >= endTime) {
      setError(
        "End time must be after start time."
      );
      return;
    }

    if (
      repeat.enabled &&
      repeat.until === ""
    ) {
      setError(
        "Please choose Repeat Until date."
      );
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await onCreateTask({
          title: trimmedTitle,

          description,

          date: formatDate(selectedDate),

          startTime,
          endTime,

          priority,
          status,

          color,

          repeat,
        });

        onClose();
      } catch {
        setError(
          "Failed to create task."
        );
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[550px] rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-xl font-semibold">
          Add Task
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Title
            </label>

            <input
              type="text"
              value={title}
              disabled={isPending}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Description
            </label>

            <textarea
              value={description}
              disabled={isPending}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="h-24 w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                disabled={isPending}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                disabled={isPending}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Priority
              </label>

              <select
                value={priority}
                disabled={isPending}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TaskPriority
                  )
                }
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">
                  High
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </label>

              <select
                value={status}
                disabled={isPending}
                onChange={(e) =>
                  setStatus(
                    e.target.value as TaskStatus
                  )
                }
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
              >
                <option value="pending">
                  Pending
                </option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Task Color
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                disabled={isPending}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                className="h-10 w-16 rounded-lg border border-slate-200"
              />

              <span className="font-mono text-xs text-slate-500">
                {color}
              </span>
            </div>
          </div>

          {/* ========================= */}
          {/* Repeat Section */}
          {/* ========================= */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <div className="mb-4 flex items-center justify-between">

              <label className="font-medium text-slate-700">
                Repeat Task
              </label>

              <input
                type="checkbox"
                checked={repeat.enabled}
                onChange={(e) =>
                  setRepeat({
                    ...repeat,
                    enabled: e.target.checked,
                    frequency: e.target.checked
                      ? "daily"
                      : "none",
                  })
                }
              />

            </div>

            {repeat.enabled && (
              <div className="space-y-4">

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Repeat Every
                  </label>

                  <div className="flex gap-3">

                    <input
                      type="number"
                      min={1}
                      value={repeat.interval}
                      onChange={(e) =>
                        setRepeat({
                          ...repeat,
                          interval:
                            Number(
                              e.target.value
                            ) || 1,
                        })
                      }
                      className="w-24 rounded-lg border border-slate-200 p-2"
                    />

                    <select
                      value={repeat.frequency}
                      onChange={(e) =>
                        setRepeat({
                          ...repeat,
                          frequency:
                            e.target
                              .value as RepeatFrequency,
                        })
                      }
                      className="flex-1 rounded-lg border border-slate-200 p-2"
                    >
                      <option value="daily">
                        Day(s)
                      </option>

                      <option value="weekly">
                        Week(s)
                      </option>

                      <option value="monthly">
                        Month(s)
                      </option>

                      <option value="yearly">
                        Year(s)
                      </option>

                    </select>

                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Repeat Until
                  </label>

                  <input
                    type="date"
                    value={repeat.until}
                    onChange={(e) =>
                      setRepeat({
                        ...repeat,
                        until: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 p-2"
                  />
                </div>

              </div>
            )}

          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isPending
              ? "Creating..."
              : "Create Task"}
          </button>

        </div>

      </div>
    </div>
  );
}