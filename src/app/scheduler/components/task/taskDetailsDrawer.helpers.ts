import {
  RepeatFrequency,
  RepeatOptions,
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types/task";

export const defaultRepeat: RepeatOptions = {
  enabled: false,
  frequency: "none",
  interval: 1,
  until: "",
};

export function getTaskId(task: Task) {
  return task.originalTaskId ?? task._id ?? task.id;
}

export function buildTaskPayload(params: {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  color: string;
  repeat: RepeatOptions;
}) {
  return {
    title: params.title,
    description: params.description,
    startTime: params.startTime,
    endTime: params.endTime,
    priority: params.priority,
    status: params.status,
    color: params.color,
    repeat: params.repeat,
  };
}

export function toggleRepeatEnabled(current: RepeatOptions, enabled: boolean): RepeatOptions {
  return {
    ...current,
    enabled,
    frequency: enabled ? "daily" : "none",
    interval: 1,
    until: enabled ? current.until : "",
  };
}

export function updateRepeatField(
  current: RepeatOptions,
  field: "interval" | "frequency" | "until",
  value: number | RepeatFrequency | string
): RepeatOptions {
  return {
    ...current,
    [field]: value,
  };
}

export function getDeleteTaskOptions(task: Task | null, taskId: string | undefined) {
  if (!taskId || !task) {
    return null;
  }

  const isRecurring = task.isRecurringOccurrence || task.repeat?.enabled;

  if (isRecurring) {
    const deleteOnlyOne = window.confirm(
      "Delete only this occurrence?\n\nOK = delete only this event\nCancel = delete entire series"
    );

    return {
      taskId,
      options: {
        scope: deleteOnlyOne ? "occurrence" : "series",
        occurrenceDate: task.dateKey ?? task.date,
      } as const,
    };
  }

  if (!window.confirm("Delete this task?")) {
    return null;
  }

  return {
    taskId,
    options: {
      scope: "series",
    } as const,
  };
}
