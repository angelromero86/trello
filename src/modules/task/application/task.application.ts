import { randomUUIDv7 } from "bun";
import type { TaskDTO } from "../domain/task";
import type { Task_UseCases } from "../domain/task.use-cases";
import Task_Schema from "../domain/task.schema";
import { TaskValidation_Error } from "../domain/errors/task.validation.error";
import { TaskNotFound_Error } from "../domain/errors/task.not-found.error";

export class Task_Application implements Task_UseCases {

    private tasks: TaskDTO[] = [{
      "id": "019c7b07-a44b-7000-82ea-64cca9769691",
      "title": "Nueva tarea 1"
    },
    {
      "id": "019c7b07-b36b-7000-89be-64e7588df5a6",
      "title": "Nueva tarea 2"
    },
    {
      "id": "019c7b07-bb30-7000-ac0a-2450d224c962",
      "title": "Nueva tarea 3"
    },
    {
      "id": "019c7b07-bb30-7000-ac0a-2450d224c962",
      "title": "Nueva tarea de ejemplo para actualizar cuando se pueda"
    }]

    find(): Promise<TaskDTO[]> {
        return Promise.resolve(this.tasks);
    }

    findById(taskId: string): Promise<TaskDTO> {
        const task = this.tasks.find((task) => task.id === taskId);
        if (!task) {
            return Promise.reject(new Error("Task not found"));
        }
        return Promise.resolve(task);
    }
  
    async create(title: string): Promise<TaskDTO> {
        try {
          const newTask = { id: randomUUIDv7(), title }
          Task_Schema.parse(newTask);
          this.tasks.push(newTask);
          return newTask;
        } catch (error) {
          throw new TaskValidation_Error(error instanceof Error ? error.message : "Unknown validation error");
        }
    }
  
    async update(taskToUpdate: TaskDTO, title: string): Promise<void> { 
        try {
          const updatedTask = { ...taskToUpdate, title };
          Task_Schema.parse(updatedTask);
          taskToUpdate.title = title;
        } catch (error) {
          throw new TaskValidation_Error(error instanceof Error ? error.message : "Unknown validation error");
        }
    }

    async delete(taskToDelete: TaskDTO): Promise<void> {
        this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
        return Promise.resolve();
    }
}
