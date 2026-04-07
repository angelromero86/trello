import express from "express";
import type { TaskDTO } from "./src/modules/task/domain/task";
import { Task_Application } from "./src/modules/task/application/task.application";
import { TaskValidation_Error } from "./src/modules/task/domain/errors/task.validation.error";
import { InMemoryTaskRepository } from "./src/modules/task/infrastructure/inMemoryTaskRepository";
import { FileTaskRepository } from "./src/modules/task/infrastructure/fileTaskRepository";
import type { Task_Repository } from "./src/modules/task/domain/task.repository";

const app = express();
app.use(express.json());
const port = 3005;

let taskRepository: Task_Repository;
if (process.env.USE_FILE_REPOSITORY === "true") {
  taskRepository = await FileTaskRepository.createRepository();
} else {
  taskRepository = new InMemoryTaskRepository();
}
const taskApplication = new Task_Application(taskRepository);

app.get("/", (req, res) => {
  res.send("Welcome to the Trello API!");
});

const tasksRoutes = express.Router();
app.use("/tasks", tasksRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// --------------------------

tasksRoutes.get("/", async (req, res) => {
  const tasks = await taskApplication.find();
  res.send(tasks);
});

tasksRoutes.post("/", async (req, res) => {
  try {
    const task = await taskApplication.create(req.body.title);
    res.status(201).send(task);
  } catch (error) {
    if (error instanceof TaskValidation_Error)  {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

// ------------------
const tasksRoutesById = express.Router({ mergeParams: true });
tasksRoutes.use("/:taskId", tasksRoutesById);

// Middleware: busca la tarea por ID y la adjunta a res.locals
tasksRoutesById.use(async (req, res, next) => {
  const taskId = String(req.params.taskId);
  try {
    const task = await taskApplication.findById(taskId);  
    // locals (en res) es el tipico sitio donde se pueden guardar
    // cosas para que las reutilicen las rutas que cuelgan de los middlewares
    res.locals.task = task;
  } catch (error) {
    res.status(404).send("Task not found");
    return;
  }
  next();
});


tasksRoutesById.get("/", (req, res) => {
  console.log("Tarea encontrada:", res.locals.task);
  res.send(res.locals.task);
});

tasksRoutesById.put("/", async (req, res) => {
  try {
    const task: TaskDTO = res.locals.task;
    await taskApplication.update(task.id, { title: req.body.title });
    res.status(200).send("Tarea actualizada");  
  } catch (error: any) {
    res.status(400).send(error.message);
    return;
  }
});

tasksRoutesById.delete("/", async (req, res) => {
  const task: TaskDTO = res.locals.task;
  await taskApplication.delete(task.id);
  res.status(200).send("Eliminar una tarea");
});
