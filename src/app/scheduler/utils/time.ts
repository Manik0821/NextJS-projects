import { PIXELS_PER_MINUTE } from "../constants/scheduler";

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function getStartMinutes(task: {
  startTime: string;
}) {
  return timeToMinutes(task.startTime);
}

export function getEndMinutes(task: {
  endTime: string;
}) {
  return timeToMinutes(task.endTime);
}

export function getTaskTop(task: {
  startTime: string;
}) {
  return timeToMinutes(task.startTime) * PIXELS_PER_MINUTE;
}

export function getTaskHeight(task: {
  startTime: string;
  endTime: string;
}) {
  return Math.max(
    (timeToMinutes(task.endTime) -
      timeToMinutes(task.startTime)) *
      PIXELS_PER_MINUTE,
    24
  );
}