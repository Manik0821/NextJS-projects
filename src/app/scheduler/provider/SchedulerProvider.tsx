"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { Task } from "../types/task";

export type SchedulerView =
  | "day"
  | "week"
  | "month";

interface SchedulerContextType {
  tasks: Task[];
  loading: boolean;

  selectedTask: Task | null;
  isDetailsOpen: boolean;

  openDetails: (task: Task) => void;
  closeDetails: () => void;

  refreshTasks: () => Promise<void>;

  createTask: (
    task: Partial<Task>
  ) => Promise<void>;

  updateTask: (
    id: string,
    task: Partial<Task>
  ) => Promise<void>;

  deleteTask: (
    id: string,
    options?: {
      scope?: "occurrence" | "series";
      occurrenceDate?: string;
    }
  ) => Promise<void>;

  changeDate: (date: Date) => void;
  changeView: (
    view: SchedulerView
  ) => void;
}

const SchedulerContext =
  createContext<SchedulerContextType | null>(
    null
  );

interface SchedulerProviderProps {
  children: ReactNode;

  tasks: Task[];
  loading: boolean;

  refreshTasks: () => Promise<void>;

  createTask: (
    task: Partial<Task>
  ) => Promise<void>;

  updateTask: (
    id: string,
    task: Partial<Task>
  ) => Promise<void>;

  deleteTask: (
    id: string,
    options?: {
      scope?: "occurrence" | "series";
      occurrenceDate?: string;
    }
  ) => Promise<void>;

  changeDate: (date: Date) => void;

  changeView: (
    view: SchedulerView
  ) => void;
}

export function SchedulerProvider({
  children,

  tasks,
  loading,

  refreshTasks,

  createTask,
  updateTask,
  deleteTask,

  changeDate,
  changeView,
}: SchedulerProviderProps) {
  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [isDetailsOpen, setDetailsOpen] =
    useState(false);

  function openDetails(task: Task) {
    setSelectedTask(task);
    setDetailsOpen(true);
  }

  function closeDetails() {
    setSelectedTask(null);
    setDetailsOpen(false);
  }

  const value = useMemo(
    () => ({
      tasks,
      loading,

      selectedTask,
      isDetailsOpen,

      openDetails,
      closeDetails,

      refreshTasks,

      createTask,
      updateTask,
      deleteTask,

      changeDate,
      changeView,
    }),
    [
      tasks,
      loading,

      selectedTask,
      isDetailsOpen,

      refreshTasks,

      createTask,
      updateTask,
      deleteTask,

      changeDate,
      changeView,
    ]
  );

  return (
    <SchedulerContext.Provider
      value={value}
    >
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context =
    useContext(SchedulerContext);

  if (!context) {
    throw new Error(
      "useScheduler must be used inside SchedulerProvider."
    );
  }

  return context;
}