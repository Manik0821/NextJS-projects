export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface RepeatOptions {
  enabled: boolean;
  frequency: RepeatFrequency;
  interval: number;
  until: string;
}

export interface Task {
  id?: string;
  _id?: string;

  originalTaskId?: string;
  isRecurringOccurrence?: boolean;

  title: string;
  description: string;

  date: string;
  dateKey?: string;

  startTime: string;
  endTime: string;

  startMinutes: number;
  endMinutes: number;

  priority: TaskPriority;
  status: TaskStatus;

  color: string;

  repeat?: RepeatOptions;

  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CalendarEvent {
  task: Task;

  top: number;
  height: number;

  left: number;
  width: number;

  column: number;
  totalColumns: number;

  overlaps: string[];
}