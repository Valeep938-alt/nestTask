import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.email("Ingresa un correo válido"),
  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .max(72, "Máximo 72 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
