import { z } from "zod";
import { TASK_STATUSES } from "../constants";

const opcional = (schema: z.ZodString) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

export const createTaskSchema = z.object({
  user_id: z.string().min(1, "Selecciona un estudiante"),
  title: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(150, "Máximo 150 caracteres"),
  description: opcional(z.string().max(2000, "Máximo 2000 caracteres")),
  due_date: opcional(z.string()),
  task_type_id: opcional(z.string()),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  user_id: z.string().min(1, "Selecciona un estudiante"),
  title: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(150, "Máximo 150 caracteres"),
  status: z.enum(TASK_STATUSES),
  description: opcional(z.string().max(2000, "Máximo 2000 caracteres")),
  due_date: opcional(z.string()),
  task_type_id: opcional(z.string()),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

export const createTaskTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(80, "Máximo 80 caracteres"),
  description: opcional(z.string().max(200, "Máximo 200 caracteres")),
});

export type CreateTaskTypeFormData = z.infer<typeof createTaskTypeSchema>;
