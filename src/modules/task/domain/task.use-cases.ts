import type { TaskDTO, UpdateTaskDTO } from "./task";

export interface Task_UseCases {
  find: () => Promise<TaskDTO[]>;
  findById(taskId: string): Promise<TaskDTO>
  create: (title: string) => Promise<TaskDTO>;
  update: (taskId: string, changes: UpdateTaskDTO) => Promise<void>;
  delete: (taskId: string) => Promise<void>;
}
