export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface TaskDTO {
  id: string;

  title: string;
  description: string;

  date: string;

  startTime: string;
  endTime: string;

  startMinutes: number;
  endMinutes: number;

  priority: TaskPriority;
  status: TaskStatus;

  color: string;

  createdAt: string;
  updatedAt: string;
}
export interface Task {
    id?: string;
  
    _id?: string;
  
    title: string;
    description: string;
  
    date: string;
  
    startTime: string;
    endTime: string;
  
    startMinutes: number;
    endMinutes: number;
  
    priority: TaskPriority;
    status: TaskStatus;
  
    color: string;
  
    createdAt: string;
    updatedAt: string;
  }