export type SchedulerIntent =
  | "query"
  | "create"
  | "update"
  | "delete_occurrence"
  | "delete_series"
  | "unknown";

export type RepeatFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface SchedulerIntentResult {
  intent: SchedulerIntent;

  taskId?: string;
  occurrenceDate?: string;

  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;

  lookup?: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };

  startDate?: string;
  endDate?: string;
  confirm?: boolean;

  task?: {
    title?: string;
    description?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in_progress" | "completed";
    color?: string;
    repeat?: {
      enabled: boolean;
      frequency: RepeatFrequency;
      interval: number;
      until: string;
    };
  };
}

export interface SchedulerAIRequest {
  message: string;
  confirm?: boolean;
  context?: {
    selectedDate?: string;
    currentDate?: string;
  };
}
