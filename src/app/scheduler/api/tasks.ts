import { Task } from "../types/task";

const BASE_URL = "/api/tasks";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TaskQuery {
  startDate: string;
  endDate: string;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function normalizeTask(task: any): Task {
  return {
    ...task,

    id: task.id ?? task._id,

    date:
      task.dateKey ??
      String(task.date).substring(0, 10),

    startMinutes: timeToMinutes(task.startTime),
    endMinutes: timeToMinutes(task.endTime),

    repeat: task.repeat ?? {
      enabled: false,
      frequency: "none",
      interval: 1,
      until: "",
    },
  };
}

export async function getTasks({
  startDate,
  endDate,
}: TaskQuery) {
  const res = await fetch(
    `${BASE_URL}?startDate=${startDate}&endDate=${endDate}`,
    {
      cache: "no-store",
    }
  );

  const json = await res.json();

  json.data = Array.isArray(json.data)
    ? json.data.map(normalizeTask)
    : [];

  return json;
}

export async function createTask(
  task: Partial<Task>
) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return (await res.json()) as ApiResponse<Task>;
}

export async function updateTask(
  id: string,
  task: Partial<Task>
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  return (await res.json()) as ApiResponse<Task>;
}

export async function deleteTask(
  id: string,
  options?: {
    scope?: "occurrence" | "series";
    occurrenceDate?: string;
  }
) {
  const params = new URLSearchParams();

  if (options?.scope) {
    params.set("scope", options.scope);
  }

  if (options?.occurrenceDate) {
    params.set(
      "occurrenceDate",
      options.occurrenceDate
    );
  }

  const query = params.toString();

  const res = await fetch(
    `${BASE_URL}/${id}${query ? `?${query}` : ""}`,
    {
      method: "DELETE",
    }
  );

  return res.json();
}