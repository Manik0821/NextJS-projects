import { Task } from "../../../types/task";
import { buildCalendarEvents } from "../../../utils/taskLayout";

export function formatLocalDate(value: Date | string) {
  if (typeof value === "string") {
    return value.substring(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTaskDateKey(task: Task) {
  return task.dateKey ?? task.date.substring(0, 10);
}

export function getEventCardVariant(height: number) {
  if (height < 30) return "tiny";
  if (height < 45) return "compact";
  return "standard";
}

export function getHourLabel(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour > 12) return `${hour - 12} PM`;
  if (hour === 12) return "12 PM";
  return `${hour} AM`;
}

export function getWeekViewEvents(tasks: Task[], date: Date | string, pixelsPerMinute = 2) {
  const dateKey = formatLocalDate(date);
  const dayTasks = tasks.filter((task) => getTaskDateKey(task) === dateKey);

  return buildCalendarEvents(dayTasks, { pixelsPerMinute });
}
