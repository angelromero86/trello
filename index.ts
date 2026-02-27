import express from "express";
import type { Task } from "./src/modules/task/domain/task";
import { Task_Application } from "./src/modules/task/application/task.application";

const app = express();
app.use(express.json());
const port = 3005;

const taskApplication = new Task_Application()

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

tasksRoutes.post("/", (req, res) => {
  taskApplication.create(req.body.title);
  res.status(201).send("Tarea creada");
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
  const task: Task = res.locals.task;
  await taskApplication.update(task, req.body.title);
  res.status(200).send("Tarea actualizada");
});

tasksRoutesById.delete("/", async (req, res) => {
  const task: Task = res.locals.task;
  await taskApplication.delete(task);
  res.status(200).send("Eliminar una tarea");
});
