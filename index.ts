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

tasksRoutes.get("/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);
  // A la hora de enviar una respuesta, debemos tener en cuenta los códigos de HTTP
  // https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status
  // En nuestro caso mandaremos 200 si la encontramos y 404 si no la encontramos
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  res.send(task);
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

tasksRoutes.put("/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  task.title = req.body.title;
  res.status(200).send("Tarea actualizada");
});

tasksRoutes.delete("/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  const taskIndex = tasks.indexOf(task);
  tasks.splice(taskIndex, 1);
  res.status(200).send("Eliminar una tarea");
});


