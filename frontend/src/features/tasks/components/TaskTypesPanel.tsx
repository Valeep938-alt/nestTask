"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import { createTaskTypeSchema, type CreateTaskTypeFormData } from "../schemas";
import { useTaskTypes } from "../hooks/useQueries";
import { useCreateTaskType, useDeleteTaskType } from "../hooks/useMutations";

export function TaskTypesPanel() {
  const {
    data: types = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTaskTypes();
  const createType = useCreateTaskType();
  const deleteType = useDeleteTaskType();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskTypeFormData>({
    resolver: zodResolver(createTaskTypeSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = (data: CreateTaskTypeFormData) => {
    createType.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <>
      <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Nuevo tipo de tarea</h2>

        {createType.isError && (
          <div className="alert">{getApiErrorMessage(createType.error)}</div>
        )}

        <div className="form-grid">
          <div>
            <label className="label" htmlFor="type-name">
              Nombre
            </label>
            <input
              id="type-name"
              className="input"
              placeholder="Ej. Ensayo, Taller, Quiz"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="field-error">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="type-desc">
              Descripción
            </label>
            <input
              id="type-desc"
              className="input"
              {...register("description")}
            />
          </div>
        </div>

        <button
          className="btn"
          style={{ marginTop: "1.2rem" }}
          disabled={createType.isPending}
        >
          {createType.isPending ? "Creando…" : "Crear tipo"}
        </button>
      </form>

      <div className="panel">
        <h2>Tipos existentes</h2>

        {isLoading && <p className="muted">Cargando…</p>}
        {isError && (
          <>
            <div className="alert">{getApiErrorMessage(error)}</div>
            <button className="btn outline" onClick={() => refetch()}>
              Reintentar
            </button>
          </>
        )}

        {!isLoading && !isError && types.length === 0 && (
          <p className="muted">Aún no hay tipos de tarea.</p>
        )}

        {types.map((t) => (
          <div className="row" key={t.id}>
            <div>
              <strong style={{ fontWeight: 500 }}>{t.name}</strong>
              {t.description && <p className="card-meta">{t.description}</p>}
            </div>
            <button
              className="btn sm danger pill"
              onClick={() => deleteType.mutate(t.id)}
              disabled={deleteType.isPending}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
