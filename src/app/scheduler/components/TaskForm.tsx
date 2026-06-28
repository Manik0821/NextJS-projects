"use client";

import { useState, useEffect } from "react";
import FormField from "./FormField";

type RepeatConfig = {
  enabled: boolean;
  frequency: "none" | "daily" | "weekly" | "monthly";
  interval: number;
  until: string;
};

type TaskFormData = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  color: string;
  repeat: RepeatConfig;
};

interface TaskFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<TaskFormData>;
  onSubmit: (task: TaskFormData) => void;
  onCancel: () => void;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    date: initialValues?.date ?? formatDate(new Date()),
    startTime: initialValues?.startTime ?? "09:00",
    endTime: initialValues?.endTime ?? "10:00",
    priority: initialValues?.priority ?? "medium",
    status: initialValues?.status ?? "pending",
    color: initialValues?.color ?? "#3B82F6",

    repeat:
      initialValues?.repeat ?? {
        enabled: false,
        frequency: "none",
        interval: 1,
        until: "",
      },
  });

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      title: initialValues.title ?? "",
      description:
        initialValues.description ?? "",
      date:
        initialValues.date ??
        formatDate(new Date()),
      startTime:
        initialValues.startTime ??
        "09:00",
      endTime:
        initialValues.endTime ??
        "10:00",
      priority:
        initialValues.priority ??
        "medium",
      status:
        initialValues.status ??
        "pending",
      color:
        initialValues.color ??
        "#3B82F6",

      repeat:
        initialValues.repeat ?? {
          enabled: false,
          frequency: "none",
          interval: 1,
          until: "",
        },
    });

    setError(null);
  }, [initialValues]);

  function updateField<
    K extends keyof TaskFormData
  >(key: K, value: TaskFormData[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Task title cannot be empty."
      );
      return;
    }

    if (
      form.startTime >= form.endTime
    ) {
      setError(
        "End time must be after start time."
      );
      return;
    }

    setError(null);

    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-slate-800"
    >
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <FormField
        label="Title"
        required
      >
        <input
          type="text"
          value={form.title}
          required
          onChange={(e) =>
            updateField(
              "title",
              e.target.value
            )
          }
          className="w-full rounded-lg border border-slate-200 p-3"
        />
      </FormField>

      <FormField label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          className="w-full rounded-lg border border-slate-200 p-3"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Date"
          required
        >
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              updateField(
                "date",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </FormField>

        <FormField
          label="Color"
          required
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                updateField(
                  "color",
                  e.target.value
                )
              }
            />

            <span className="text-xs font-mono">
              {form.color}
            </span>
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Time"
          required
        >
          <input
            type="time"
            required
            value={form.startTime}
            onChange={(e) =>
              updateField(
                "startTime",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </FormField>

        <FormField
          label="End Time"
          required
        >
          <input
            type="time"
            required
            value={form.endTime}
            onChange={(e) =>
              updateField(
                "endTime",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-200 p-3"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Priority">
          <select
            value={form.priority}
            onChange={(e) =>
              updateField(
                "priority",
                e.target
                  .value as TaskFormData["priority"]
              )
            }
            className="w-full rounded-lg border border-slate-200 p-3"
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>
          </select>
        </FormField>

        <FormField label="Status">
          <select
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target
                  .value as TaskFormData["status"]
              )
            }
            className="w-full rounded-lg border border-slate-200 p-3"
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
        </FormField>
      </div>
            {/* ============================
          Repeat Task
      ============================= */}
      <FormField label="Repeat">
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.repeat.enabled}
              onChange={(e) =>
                updateField("repeat", {
                  ...form.repeat,
                  enabled: e.target.checked,

                  // Reset when disabling
                  frequency: e.target.checked
                    ? "daily"
                    : "none",
                })
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-medium">
              Repeat this task
            </span>
          </label>

          {form.repeat.enabled && (
            <div className="space-y-4">

              {/* Frequency */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Frequency
                </label>

                <select
                  value={form.repeat.frequency}
                  onChange={(e) =>
                    updateField("repeat", {
                      ...form.repeat,
                      frequency:
                        e.target.value as
                          | "daily"
                          | "weekly"
                          | "monthly",
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 p-3"
                >
                  <option value="daily">
                    Every Day
                  </option>

                  <option value="weekly">
                    Every Week
                  </option>

                  <option value="monthly">
                    Every Month
                  </option>
                </select>
              </div>

              {/* Interval */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Repeat Every
                </label>

                <div className="flex items-center gap-3">

                  <input
                    type="number"
                    min={1}
                    value={form.repeat.interval}
                    onChange={(e) =>
                      updateField("repeat", {
                        ...form.repeat,
                        interval: Number(
                          e.target.value
                        ),
                      })
                    }
                    className="w-24 rounded-lg border border-slate-200 p-3"
                  />

                  <span className="text-sm text-slate-600">
                    {form.repeat.frequency ===
                    "daily"
                      ? "day(s)"
                      : form.repeat.frequency ===
                        "weekly"
                      ? "week(s)"
                      : "month(s)"}
                  </span>

                </div>
              </div>

              {/* Until */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Repeat Until
                </label>

                <input
                  type="date"
                  value={form.repeat.until}
                  min={form.date}
                  onChange={(e) =>
                    updateField("repeat", {
                      ...form.repeat,
                      until: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 p-3"
                />
              </div>

            </div>
          )}

        </div>
      </FormField>

      {/* ============================
          Buttons
      ============================= */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          {mode === "create"
            ? "Create Task"
            : "Save Changes"}
        </button>

      </div>

    </form>
  );
}