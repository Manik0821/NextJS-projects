import Task, { ITask } from "@/db/models/Task";

export class TaskService {
  static async getTasks(
    date?: string,
    startDate?: string,
    endDate?: string
  ) {
    const query: any = {};
  
    if (date) {
      const start = new Date(date);
      start.setHours(0,0,0,0);
  
      const end = new Date(date);
      end.setHours(23,59,59,999);
  
      query.date = {
        $gte: start,
        $lte: end,
      };
    }
  
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
  
    return Task.find(query).sort({
      startMinutes: 1,
    });
  }

  static async getTaskById(id: string) {
    return Task.findById(id);
  }

  static async createTask(taskData: Partial<ITask>) {
    return Task.create(taskData);
  }

  static async updateTask(id: string, taskData: any) {
    return Task.findByIdAndUpdate(id, taskData, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteTask(id: string) {
    return Task.findByIdAndDelete(id);
  }
}