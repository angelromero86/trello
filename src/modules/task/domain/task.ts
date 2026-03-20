import Task_Schema from "./task.schema";

export interface TaskDTO {
  id: string;
  title: string;
}

export interface UpdateTaskDTO {
  title?: string;
}

export class Task {

  constructor(private data: TaskDTO) {
    Task_Schema.parse(data);
  }

  public get title() : string {
    return this.data.title;
  }

  public get id() : string {
    return this.data.id;
  }
  
  change(changes: UpdateTaskDTO) {
    if ((changes as any)['id']) {
      throw new Error("ID cannot be changed");
    }
    const updatedData = { ...this.data, ...changes };
    Task_Schema.parse(updatedData);
    this.data = updatedData;
  }

  toDTO(): TaskDTO {
    return this.data;
  }

}
