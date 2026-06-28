import { ITask } from "@/db/models/Task";
import { TaskDTO } from "@/types/task";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export class TaskMapper {
  static toDTO(task: ITask): TaskDTO {
    return {
      id: task._id.toString(),

      title: task.title,
      description: task.description,

      // IMPORTANT
      date: formatLocalDate(task.date),

      startTime: task.startTime,
      endTime: task.endTime,

      startMinutes: task.startMinutes,
      endMinutes: task.endMinutes,

      priority: task.priority,
      status: task.status,

      color: task.color,

      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  static toDTOList(tasks: ITask[]) {
    return tasks.map((task) => this.toDTO(task));
  }
}