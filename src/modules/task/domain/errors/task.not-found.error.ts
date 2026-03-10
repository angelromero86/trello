export class TaskNotFound_Error extends Error {
    constructor() {
        super("Task not found");
        this.name = "TaskNotFound_Error";
    }
}
