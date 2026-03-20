import { TaskIdDuplicated_Error } from "../domain/errors/task.id-duplicated";
import { TaskNotFound_Error } from "../domain/errors/task.not-found.error";
import type { TaskDTO } from "../domain/task";
import { Task } from "../domain/task";
import type { Task_Repository, TaskCriteria } from "../domain/task.repository";

export class InMemoryTaskRepository implements Task_Repository {

  private tasks: TaskDTO[] = [
    {
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
      "title": "Nueva tarea 4"
    },
  ]

  find(criteria?: TaskCriteria): Promise<Task[]> {
    let filteredTasks = this.tasks;

    if (criteria) {
      const criteriaIds = criteria.ids;
      const criteriaQ = criteria.q ? criteria.q.toLowerCase() : "";
      if (criteriaIds && criteriaIds.length > 0) {
        filteredTasks = filteredTasks.filter(task => criteriaIds.includes(task.id));
      }
      if (criteriaQ) {
        filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(criteriaQ));
      }
    }

    return Promise.resolve(filteredTasks.map(task => new Task(task)));
  }

  async create(task: Task): Promise<void> {
    const existingTasks = await this.find({ ids: [task.id] });
    if (existingTasks.length > 0) {
      return Promise.reject(new TaskIdDuplicated_Error());
    }
    this.tasks.push({ id: task.id, title: task.title });
    return Promise.resolve();
  }

  update(task: Task): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      return Promise.reject(new TaskNotFound_Error());
    }
    this.tasks[index] = { id: task.id, title: task.title };
    return Promise.resolve();
  }

  
  delete(task: Task): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    return Promise.resolve();
  }

}
