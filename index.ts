import { randomUUIDv7 } from "bun";
import express from "express";

const app = express();
app.use(express.json());
const port = 3005;

type Task = {
  id: string;
  title: string;
};
const tasks: Task[] =   [{
    "id": "019c7b07-a44b-7000-82ea-64cca9769691",
    "title": "Nueva tarea 3"
  },
  {
    "id": "019c7b07-b36b-7000-89be-64e7588df5a6",
    "title": "Nueva tarea 2"
  },
  {
    "id": "019c7b07-bb30-7000-ac0a-2450d224c962",
    "title": "Nueva tarea 1"
  }]

app.get("/", (req, res) => {
  res.send("Welcome to the Trello API!");
});

const tasksRoutes = express.Router();
app.use("/tasks", tasksRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// --------------------------

tasksRoutes.get("/", (req, res) => {
  res.send(tasks);
});

tasksRoutes.post("/", (req, res) => {
  // Cosas que hay en req que normalmente nos interesan:
  // req.body, req.params, req.query, req.headers, etc.
  // Enviamos estado 201, CREADO
  const newTask = {
    id: randomUUIDv7(),
    title: req.body.title,
  }
  tasks.push(newTask);
  res.status(201).send("Tarea creada");
});

// ------------------
const tasksRoutesById = express.Router({ mergeParams: true });
tasksRoutes.use("/:taskId", tasksRoutesById);

// Middleware: busca la tarea por ID y la adjunta a res.locals
tasksRoutesById.use((req, res, next) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  // locals (en res) es el tipico sitio donde se pueden guardar
  // cosas para que las reutilicen las rutas que cuelgan de los middlewares
  res.locals.task = task;
  next();
});


tasksRoutesById.get("/", (req, res) => {
  console.log("Tarea encontrada:", res.locals.task);
  res.send(res.locals.task);
});

tasksRoutesById.put("/", (req, res) => {
  res.locals.task.title = req.body.title;
  res.status(200).send("Tarea actualizada");
});

tasksRoutesById.delete("/", (req, res) => {
  const taskIndex = tasks.indexOf(res.locals.task);
  tasks.splice(taskIndex, 1);
  res.status(200).send("Eliminar una tarea");
});
