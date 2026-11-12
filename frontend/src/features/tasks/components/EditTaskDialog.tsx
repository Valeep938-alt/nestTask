"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import type { StudentOption } from "@/api/services/usersService";
import {
  STATUS_LABELS,
  type Task,
  type TaskStatus,
  type TaskType,
} from "../types";
import { updateTaskSchema, type UpdateTaskFormData } from "../schemas";
import { toDateInput } from "../utils";
import { useUpdateTask } from "../hooks/useMutations";

interface EditTaskDialogProps {
  task: Task | null;
  students: StudentOption[];
  types: TaskType[];
  onClose: () => void;
}

export function EditTaskDialog({
  task,
  students,
  types,
  onClose,
}: EditTaskDialogProps) {
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        user_id: task.user_id,
        title: task.title,
        status: task.status,
        description: task.description ?? "",
        due_date: toDateInput(task.due_date),
        task_type_id: task.task_type_id ? String(task.task_type_id) : "",
      });
    }
  }, [task, reset]);

  const onSubmit = (data: UpdateTaskFormData) => {
    if (!task) return;
    updateTask.mutate({ id: task.id, data }, { onSuccess: onClose });
  };

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="modal-card sm:max-w-none">
        <DialogTitle>Editar tarea</DialogTitle>
        <DialogDescription className="sr-only">
          Modifica el título, el estudiante, el tipo, el estado o la fecha de
          entrega.
        </DialogDescription>

        {updateTask.isError && (
          <div className="alert">{getApiErrorMessage(updateTask.error)}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div>
              <label className="label" htmlFor="edit-title">
                Título
              </label>
              <input
                id="edit-title"
                className="input"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <p className="field-error">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="edit-student">
                Estudiante
              </label>
              <select
                id="edit-student"
                className="select"
                {...register("user_id")}
              >
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
              <label className="label" htmlFor="edit-type">
                Tipo de tarea
              </label>
              <select
                id="edit-type"
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
              <label className="label" htmlFor="edit-status">
                Estado
              </label>
              <select
                id="edit-status"
                className="select"
                {...register("status")}
              >
                {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="edit-due">
                Fecha de entrega
              </label>
              <input
                id="edit-due"
                className="input"
                type="date"
                {...register("due_date")}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: "1.2rem" }}>
            <label className="label" htmlFor="edit-desc">
              Descripción
            </label>
            <textarea
              id="edit-desc"
              className="textarea"
              {...register("description")}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn outline"
              onClick={onClose}
              disabled={updateTask.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn"
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
