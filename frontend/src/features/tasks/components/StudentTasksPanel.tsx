"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import { useTasks, useTaskTypes } from "../hooks/useQueries";
import { useUpdateTaskStatus } from "../hooks/useMutations";
import { EMPTY_FILTERS, filterTasks } from "../utils";
import { TaskFilters } from "./TaskFilters";
import { TaskCard } from "./TaskCard";

export function StudentTasksPanel() {
  const tasksQuery = useTasks();
  const typesQuery = useTaskTypes();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const updateStatus = useUpdateTaskStatus();

  const tasks = tasksQuery.data ?? [];
  const types = typesQuery.data ?? [];
  const visible = filterTasks(tasks, filters);

  return (
    <>
      <TaskFilters value={filters} onChange={setFilters} types={types} />

      <div className="container" style={{ paddingBottom: "5rem" }}>
        {tasksQuery.isLoading && <p className="muted">Cargando…</p>}

        {tasksQuery.isError && (
          <>
            <div className="alert">{getApiErrorMessage(tasksQuery.error)}</div>
            <button
              className="btn outline"
              onClick={() => tasksQuery.refetch()}
            >
              Reintentar
            </button>
          </>
        )}

        {!tasksQuery.isLoading &&
          !tasksQuery.isError &&
          visible.length === 0 && (
            <div className="empty">Aún no tienes tareas asignadas.</div>
          )}

        {visible.length > 0 && (
          <div className="grid">
            {visible.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onStatusChange={(id, status) =>
                  updateStatus.mutate({ id, status })
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
