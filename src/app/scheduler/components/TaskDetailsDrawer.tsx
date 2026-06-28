"use client";

import { useEffect, useState } from "react";

import { useScheduler } from "../provider";
import {
  RepeatFrequency,
  RepeatOptions,
  TaskPriority,
  TaskStatus,
} from "../types/task";

const defaultRepeat: RepeatOptions = {
  enabled: false,
  frequency: "none",
  interval: 1,
  until: "",
};

export default function TaskDetailsDrawer() {
  const {
    selectedTask,
    isDetailsOpen,
    closeDetails,
    updateTask,
    deleteTask,
    refreshTasks,
  } = useScheduler();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [startTime, setStartTime] =
    useState("");
  const [endTime, setEndTime] =
    useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [status, setStatus] =
    useState<TaskStatus>("pending");
  const [color, setColor] =
    useState("#3B82F6");
  const [repeat, setRepeat] =
    useState<RepeatOptions>(defaultRepeat);

  useEffect(() => {
    if (!selectedTask) return;

    setTitle(selectedTask.title);
    setDescription(selectedTask.description);
    setStartTime(selectedTask.startTime);
    setEndTime(selectedTask.endTime);
    setPriority(selectedTask.priority);
    setStatus(selectedTask.status);
    setColor(selectedTask.color);

    setRepeat(
      selectedTask.repeat ?? defaultRepeat
    );
  }, [selectedTask]);

  if (!isDetailsOpen || !selectedTask) {
    return null;
  }

  const taskId =
    selectedTask.originalTaskId ??
    selectedTask._id ??
    selectedTask.id;

  async function saveTask() {
    if (!taskId) return;

    await updateTask(taskId, {
      title,
      description,
      startTime,
      endTime,
      priority,
      status,
      color,
      repeat,
    });

    await refreshTasks();
    closeDetails();
  }

  async function markComplete() {
    if (!taskId) return;

    await updateTask(taskId, {
      status: "completed",
    });

    await refreshTasks();
    closeDetails();
  }

  async function removeTask() {
    if (!taskId) return;

    const isRecurring =
      selectedTask?.isRecurringOccurrence ||
      selectedTask?.repeat?.enabled;

    if (isRecurring) {
      const deleteOnlyOne = window.confirm(
        "Delete only this occurrence?\n\nOK = delete only this event\nCancel = delete entire series"
      );

      await deleteTask(taskId, {
        scope: deleteOnlyOne
          ? "occurrence"
          : "series",
        occurrenceDate:
          selectedTask.dateKey ?? selectedTask.date,
      });
    } else {
      if (!window.confirm("Delete this task?")) {
        return;
      }

      await deleteTask(taskId, {
        scope: "series",
      });
    }

    await refreshTasks();
    closeDetails();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex h-full w-[460px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-lg font-semibold">
            Edit Task
          </h2>

          <button
            onClick={closeDetails}
            className="rounded p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TaskPriority
                  )
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="low">Low</option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as TaskStatus
                  )
                }
                className="w-full rounded-lg border p-3"
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

          <div>
            <label className="mb-1 block text-sm font-medium">
              Color
            </label>

            <input
              type="color"
              value={color}
              onChange={(e) =>
                setColor(e.target.value)
              }
              className="h-12 w-full rounded-lg border"
            />
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-700">
                  Repeat Task
                </div>

                <div className="text-xs text-slate-500">
                  Repeat this task daily, weekly, monthly, or yearly.
                </div>
              </div>

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
                    interval: 1,
                    until: e.target.checked
                      ? repeat.until
                      : "",
                  })
                }
                className="h-4 w-4"
              />
            </div>

            {repeat.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
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
                      className="w-24 rounded-lg border bg-white p-3"
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
                      className="flex-1 rounded-lg border bg-white p-3"
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
                  <label className="mb-1 block text-sm font-medium">
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
                    className="w-full rounded-lg border bg-white p-3"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t p-5">
          <button
            onClick={removeTask}
            className="rounded-lg bg-red-600 py-3 text-white"
          >
            Delete
          </button>

          <button
            onClick={markComplete}
            className="rounded-lg bg-green-600 py-3 text-white"
          >
            Complete
          </button>

          <button
            onClick={saveTask}
            className="rounded-lg bg-blue-600 py-3 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}