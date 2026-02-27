import type { Task } from "./task";

export interface Task_UseCases {
  find: () => Promise<Task[]>;
  findById(taskId: string): Promise<Task>
  create: (title: string) => Promise<void>;
  update: (taskToUpdate: Task, title: string) => Promise<void>;
  delete: (taskToDelete: Task) => Promise<void>;
}
