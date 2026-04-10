import { TaskIdDuplicated_Error } from "../domain/errors/task.id-duplicated";
import { TaskNotFound_Error } from "../domain/errors/task.not-found.error";
import { Task } from "../domain/task";
import type { TaskDTO } from "../domain/task";
import type { TaskCriteria } from "../domain/task.repository";

export class FileTaskRepository {
  private constructor() {}

  static async createRepository(): Promise<FileTaskRepository> {
    await FileTaskRepository.ensureFileExists();
    return new FileTaskRepository();
  }

  private static async ensureFileExists(): Promise<void> {
    const path = "./tasks.json";
    const file = Bun.file(path);
    if (!(await file.exists())) {
      await Bun.write(path, JSON.stringify([]));
    }
  }

  async find(criteria?: TaskCriteria): Promise<Task[]> {
    const file = Bun.file("./tasks.json");
    const tasks: TaskDTO[] = JSON.parse(await file.text());
    let filteredTasks = tasks;

    if (criteria) {
      const criteriaIds = criteria.ids;
      const criteriaQ = criteria.q ? criteria.q.toLowerCase() : "";
      if (criteriaIds && criteriaIds.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          criteriaIds.includes(task.id),
        );
      }
      if (criteriaQ) {
        filteredTasks = filteredTasks.filter((task) =>
          task.title.toLowerCase().includes(criteriaQ),
        );
      }
    }

    return filteredTasks.map((task: TaskDTO) => new Task(task));
  }

  async create(task: Task): Promise<void> {
    const existingTasks: Task[] = await this.find();
    if (existingTasks.some((t) => t.id === task.id)) {
      throw new TaskIdDuplicated_Error();
    }
    existingTasks.push(task);
    await Bun.write(
      "./tasks.json",
      JSON.stringify(existingTasks.map((task) => task.toDTO())),
    );
  }

  async update(task: Task): Promise<void> {
    const existingTasks: TaskDTO[] = (await this.find()).map((t) => t.toDTO());
    const taskToUpdateIdex = existingTasks.findIndex((t) => t.id === task.id);
    if (taskToUpdateIdex === -1) {
      throw new TaskNotFound_Error();
    }
    existingTasks[taskToUpdateIdex] = task.toDTO();
    await Bun.write("./tasks.json", JSON.stringify(existingTasks));
  }

  async delete(task: Task): Promise<void> {
    const existingTasks: Task[] = await this.find();
    const taskToDelete = existingTasks.find((t) => t.id === task.id);
    if (!taskToDelete) {
      throw new TaskNotFound_Error();
    }
    existingTasks.splice(existingTasks.indexOf(taskToDelete), 1);
    await Bun.write(
      "./tasks.json",
      JSON.stringify(existingTasks.map((task) => task.toDTO())),
    );
  }
}
