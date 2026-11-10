import { STATUS_LABELS, Task, TaskStatus } from '../api/types';

interface Props {
  task: Task;
  showStudent?: boolean;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
}

export default function TaskCard({ task, showStudent, onStatusChange, onDelete }: Props) {
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

      {showStudent && task.user && <p className="card-meta">Estudiante: {task.user.name}</p>}
      {task.due_date && (
        <p className="card-meta">Entrega: {new Date(task.due_date).toLocaleDateString('es-CO')}</p>
      )}

      <div className="card-actions">
        {onStatusChange && (
          <select
            className="select"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          >
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        )}
        {onDelete && (
          <button className="btn sm danger pill" onClick={() => onDelete(task.id)}>
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
