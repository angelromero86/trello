import { randomUUIDv7 } from "bun";
import express from "express";

const app = express();
app.use(express.json());
const port = 3005;

type Task = {
  id: string;
  title: string;
};
const tasks: Task[] = []

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

tasksRoutes.get("/:id", (req, res) => {
  res.send("Obtener una tarea por ID");
});

tasksRoutes.post("/", (req, res) => {
  // Cosas que hay en req que normalmente nos interesan:
  // req.body, req.params, req.query, req.headers, etc.
  const newTask = {
    id: randomUUIDv7(),
    title: req.body.title,
  }
  tasks.push(newTask);
  res.send("Crear una nueva tarea");
});

tasksRoutes.put("/:taskId", (req, res) => {
  res.send("Actualizar una tarea");
});

tasksRoutes.delete("/:taskId", (req, res) => {
  res.send("Eliminar una tarea");
});


