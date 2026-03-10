import z from "zod";

const Task_Schema = z.object({
  id: z.string({ error: "El id es requerido" }).uuid({ error: "El id debe ser un UUID válido" }),
  title: z
    .string({ error: "El título es requerido" })
    .min(1, { message: "El título no puede estar vacío" })
    .max(20, { message: "El título no puede tener más de 20 caracteres" }),
});

export default Task_Schema;
