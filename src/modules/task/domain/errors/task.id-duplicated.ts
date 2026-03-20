export class TaskIdDuplicated_Error extends Error {
    constructor() {
        super("Task ID already exists");
        this.name = "TaskIdDuplicated_Error";
    }
}
