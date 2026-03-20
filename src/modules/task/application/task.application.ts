import { randomUUIDv7 } from "bun";
import { Task, type TaskDTO, type UpdateTaskDTO } from "../domain/task";
import type { Task_UseCases } from "../domain/task.use-cases";
import Task_Schema from "../domain/task.schema";
import { TaskValidation_Error } from "../domain/errors/task.validation.error";
import type { Task_Repository } from "../domain/task.repository";
import { TaskNotFound_Error } from "../domain/errors/task.not-found.error";

export class Task_Application implements Task_UseCases {

    constructor(private readonly repo: Task_Repository) { }

    async find(): Promise<TaskDTO[]> {
        const tasks = await this.repo.find();
        return tasks.map(task => task.toDTO());
    }

    async findById(taskId: string): Promise<TaskDTO> {
        const [ task ] = await this.repo.find({ ids: [taskId] });
        if (!task) {
            return Promise.reject(new TaskNotFound_Error());
        }
        return task.toDTO();
    }
  
    async create(title: string): Promise<TaskDTO> {
        try {
          const task = new Task({ id: randomUUIDv7(), title })
          await this.repo.create(task);
          return task.toDTO();
        } catch (error) {
          throw new TaskValidation_Error(error instanceof Error ? error.message : "Unknown validation error");
        }
    }
  
    async update(taskId: string, changes: UpdateTaskDTO): Promise<void> { 
        try {
          const [ task ] = await this.repo.find({ ids: [taskId] });
          if (!task) {
              return Promise.reject(new TaskNotFound_Error());
          }
          task.change(changes);
          await this.repo.update(task);
        } catch (error) {
          throw new TaskValidation_Error(error instanceof Error ? error.message : "Unknown validation error");
        }
    }

    async delete(taskId: string): Promise<void> {
        const [ task ] = await this.repo.find({ ids: [taskId] });
        if (!task) {
            return Promise.reject(new TaskNotFound_Error());
        }
        await this.repo.delete(task);
    }
}
