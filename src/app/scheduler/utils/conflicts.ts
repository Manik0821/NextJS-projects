import { Task } from "../types/task";

export function findConflicts(
  tasks: Task[],
  target: Task
): Task[] {
  return tasks.filter((t) => {
    if (t.id === target.id) return false;

    return (
      target.startMinutes < t.endMinutes &&
      target.endMinutes > t.startMinutes
    );
  });
}