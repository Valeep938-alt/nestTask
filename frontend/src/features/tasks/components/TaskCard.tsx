"use client";

import { STATUS_LABELS, type Task, type TaskStatus } from "../types";

interface TaskCardProps {
  task: Task;
  showStudent?: boolean;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({
  task,
  showStudent,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="card">
      <div className="badges">
        <span className="badge" data-status={task.status}>
          {STATUS_LABELS[task.status]}
        </span>
        {task.task_type && <span className="badge">{task.task_type.name}</span>}
      </div>

      <h3>{task.title}</h3>
      {task.description && <p className="card-meta">{task.description}</p>}

      {showStudent && task.user && (
        <p className="card-meta">Estudiante: {task.user.name}</p>
      )}
      {task.due_date && (
        <p className="card-meta">
          Entrega: {new Date(task.due_date).toLocaleDateString("es-CO")}
        </p>
      )}

      <div className="card-actions">
        {onStatusChange && (
          <select
            className="select"
            aria-label="Cambiar estado"
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
          >
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        )}
        {onEdit && (
          <button className="btn sm outline pill" onClick={() => onEdit(task)}>
            Editar
          </button>
        )}
        {onDelete && (
          <button
            className="btn sm danger pill"
            onClick={() => onDelete(task.id)}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
