"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import type { StudentOption } from "@/api/services/usersService";
import type { TaskType } from "../types";
import { createTaskSchema, type CreateTaskFormData } from "../schemas";
import { useCreateTask } from "../hooks/useMutations";

interface AssignTaskFormProps {
  students: StudentOption[];
  types: TaskType[];
}

export function AssignTaskForm({ students, types }: AssignTaskFormProps) {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      user_id: "",
      title: "",
      description: "",
      due_date: "",
      task_type_id: "",
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    createTask.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Asignar tarea</h2>

      {createTask.isError && (
        <div className="alert">{getApiErrorMessage(createTask.error)}</div>
      )}

      <div className="form-grid">
        <div>
          <label className="label" htmlFor="task-student">
            Estudiante
          </label>
          <select id="task-student" className="select" {...register("user_id")}>
            <option value="">Selecciona…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.email}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <p className="field-error">{errors.user_id.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="task-title">
            Título
          </label>
          <input
            id="task-title"
            className="input"
            placeholder="Ej. Ensayo sobre la biodiversidad"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="field-error">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="task-type">
            Tipo de tarea
          </label>
          <select
            id="task-type"
            className="select"
            {...register("task_type_id")}
          >
            <option value="">Sin tipo</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="task-due">
            Fecha de entrega
          </label>
          <input
            id="task-due"
            className="input"
            type="date"
            {...register("due_date")}
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: "1.2rem" }}>
        <label className="label" htmlFor="task-desc">
          Descripción
        </label>
        <textarea
          id="task-desc"
          className="textarea"
          {...register("description")}
        />
      </div>

      <button className="btn" disabled={createTask.isPending}>
        {createTask.isPending ? "Guardando…" : "Asignar tarea"}
      </button>
    </form>
  );
}
