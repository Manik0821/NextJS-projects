"use client";

import { useCallback, useEffect, useState } from "react";

import * as api from "../api/tasks";
import { Task } from "../types/task";

interface UseTasksProps {
  startDate: string;
  endDate: string;
}

export function useTasks({
  startDate,
  endDate,
}: UseTasksProps) {
  const [tasks, setTasks] = useState<
    Task[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const refreshTasks =
    useCallback(async () => {
      setLoading(true);

      try {
        const response =
          await api.getTasks({
            startDate,
            endDate,
          });

        setTasks(response.data);
      } finally {
        setLoading(false);
      }
    }, [startDate, endDate]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  async function createTask(
    task: Partial<Task>
  ) {
    await api.createTask(task);

    await refreshTasks();
  }

  async function updateTask(
    id: string,
    task: Partial<Task>
  ) {
    await api.updateTask(id, task);

    await refreshTasks();
  }

  async function deleteTask(id: string) {
    await api.deleteTask(id);

    await refreshTasks();
  }

  return {
    tasks,
    loading,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}