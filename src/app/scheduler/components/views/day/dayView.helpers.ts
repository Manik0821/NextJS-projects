import { Task } from "../../../types/task";

export function getTaskDateKey(task: Task) {
  return task.dateKey ?? task.date.substring(0, 10);
}

export function getEventCardVariant(height: number) {
  if (height < 30) return "tiny";
  if (height < 45) return "compact";

  return "standard";
}
