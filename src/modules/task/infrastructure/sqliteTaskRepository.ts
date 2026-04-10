import { Database } from "bun:sqlite";
import { TaskIdDuplicated_Error } from "../domain/errors/task.id-duplicated";
import { TaskNotFound_Error } from "../domain/errors/task.not-found.error";
import { Task } from "../domain/task";
import type { TaskDTO } from "../domain/task";
import type { Task_Repository, TaskCriteria } from "../domain/task.repository";

const DB_PATH = "./tasks.db";

function initializeDatabase(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id    TEXT PRIMARY KEY NOT NULL,
      title TEXT             NOT NULL
    )
  `);
}

export class SqliteTaskRepository implements Task_Repository {
  private constructor(private readonly db: Database) {}

  static createRepository(): SqliteTaskRepository {
    const db = new Database(DB_PATH);
    initializeDatabase(db);
    return new SqliteTaskRepository(db);
  }

  async find(criteria?: TaskCriteria): Promise<Task[]> {
    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (criteria?.ids && criteria.ids.length > 0) {
      const placeholders = criteria.ids.map((_, i) => `$id${i}`).join(", ");
      conditions.push(`id IN (${placeholders})`);
      criteria.ids.forEach((id, i) => {
        params[`$id${i}`] = id;
      });
    }

    if (criteria?.q) {
      conditions.push(`title LIKE $q`);
      params.$q = `%${criteria.q}%`;
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = this.db
      .query<TaskDTO, typeof params>(`SELECT id, title FROM tasks ${where}`)
      .all(params);

    return rows.map((row) => new Task(row));
  }

  async create(task: Task): Promise<void> {
    const existing = this.db
      .query<{ id: string }, string>("SELECT id FROM tasks WHERE id = ?")
      .get(task.id);

    if (existing) {
      throw new TaskIdDuplicated_Error();
    }

    this.db
      .query("INSERT INTO tasks (id, title) VALUES ($id, $title)")
      .run({ $id: task.id, $title: task.title });
  }

  async update(task: Task): Promise<void> {
    const existing = this.db
      .query<{ id: string }, string>("SELECT id FROM tasks WHERE id = ?")
      .get(task.id);

    if (!existing) {
      throw new TaskNotFound_Error();
    }

    this.db
      .query("UPDATE tasks SET title = $title WHERE id = $id")
      .run({ $title: task.title, $id: task.id });
  }

  async delete(task: Task): Promise<void> {
    const existing = this.db
      .query<{ id: string }, string>("SELECT id FROM tasks WHERE id = ?")
      .get(task.id);

    if (!existing) {
      throw new TaskNotFound_Error();
    }

    this.db.query("DELETE FROM tasks WHERE id = ?").run(task.id);
  }
}
