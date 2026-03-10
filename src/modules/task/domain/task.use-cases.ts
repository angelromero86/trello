import type { TaskDTO } from "./task";

export interface Task_UseCases {
  find: () => Promise<TaskDTO[]>;
  findById(taskId: string): Promise<TaskDTO>
  create: (title: string) => Promise<TaskDTO>;
  update: (taskToUpdate: TaskDTO, title: string) => Promise<void>;
  delete: (taskToDelete: TaskDTO) => Promise<void>;
}
