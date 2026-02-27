import { randomUUIDv7 } from "bun";
import type { Task } from "../domain/task";
import type { Task_UseCases } from "../domain/task.use-cases";

export class Task_Application implements Task_UseCases {

    private tasks: Task[] = [{
      "id": "019c7b07-a44b-7000-82ea-64cca9769691",
      "title": "Nueva tarea 3"
    },
    {
      "id": "019c7b07-b36b-7000-89be-64e7588df5a6",
      "title": "Nueva tarea 2"
    },
    {
      "id": "019c7b07-bb30-7000-ac0a-2450d224c962",
      "title": "Nueva tarea 1"
    }]

    find(): Promise<Task[]> {
        return Promise.resolve(this.tasks);
    }

    findById(taskId: string): Promise<Task> {
        const task = this.tasks.find((task) => task.id === taskId);
        if (!task) {
            return Promise.reject(new Error("Task not found"));
        }
        return Promise.resolve(task);
    }
  
    create(title: string): Promise<void> {
        const newTask = { id: randomUUIDv7(), title }
        if (title.length > 20) {
            return Promise.reject(new Error("Title must be less than 20 characters"));
        }
        this.tasks.push(newTask);
        return Promise.resolve();
    }
  
    async update(taskToUpdate: Task, title: string): Promise<void> { 
        const task = await this.findById(taskToUpdate.id);
        if (title.length > 20) {
            return Promise.reject(new Error("Title must be less than 20 characters"));
        }
        task.title = title;
        return Promise.resolve();
    }

    async delete(taskToDelete: Task): Promise<void> {
        this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
        return Promise.resolve();
    }
}
