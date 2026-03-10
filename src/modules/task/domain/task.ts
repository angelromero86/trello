import Task_Schema from "./task.schema";

export interface TaskDTO {
  id: string;
  title: string;
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
  
  change(changes: Partial<Omit<TaskDTO, "id">>) {
    const updatedData = { ...this.data, ...changes };
    Task_Schema.parse(updatedData);
    this.data = updatedData;
  }

}
