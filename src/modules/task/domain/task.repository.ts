import type { Task } from "./task";

export interface TaskCriteria {
  ids?: string[],
  q?: string,
}

export interface Task_Repository {
  find(criteria?: TaskCriteria): Promise<Task[]>
  create(task: Task): Promise<void>
  update(task: Task): Promise<void>
  delete(task: Task): Promise<void>
}
