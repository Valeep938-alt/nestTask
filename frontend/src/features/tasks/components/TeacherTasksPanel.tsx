"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import type { Task } from "../types";
import { useTasks, useTaskTypes, useStudents } from "../hooks/useQueries";
import { useUpdateTaskStatus, useDeleteTask } from "../hooks/useMutations";
import { EMPTY_FILTERS, filterTasks } from "../utils";
import { AssignTaskForm } from "./AssignTaskForm";
import { TaskFilters } from "./TaskFilters";
import { TaskCard } from "./TaskCard";
import { EditTaskDialog } from "./EditTaskDialog";

export function TeacherTasksPanel() {
  const tasksQuery = useTasks();
  const typesQuery = useTaskTypes();
  const studentsQuery = useStudents();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editing, setEditing] = useState<Task | null>(null);

  const updateStatus = useUpdateTaskStatus();
  const removeTask = useDeleteTask();

  const tasks = tasksQuery.data ?? [];
  const types = typesQuery.data ?? [];
  const students = studentsQuery.data ?? [];
  const visible = filterTasks(tasks, filters);

  return (
    <>
      <div className="container">
        <AssignTaskForm students={students} types={types} />
      </div>

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
            <div className="empty">No hay tareas para mostrar.</div>
          )}

        {visible.length > 0 && (
          <div className="grid">
            {visible.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                showStudent
                onStatusChange={(id, status) =>
                  updateStatus.mutate({ id, status })
                }
                onEdit={setEditing}
                onDelete={(id) => removeTask.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      <EditTaskDialog
        task={editing}
        students={students}
        types={types}
        onClose={() => setEditing(null)}
      />
    </>
  );
}
