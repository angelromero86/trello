export class TaskValidation_Error extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TaskValidation_Error";
    }
}
