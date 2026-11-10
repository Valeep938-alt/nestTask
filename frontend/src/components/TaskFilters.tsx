import { Task, TaskStatus, TaskType, STATUS_LABELS } from '../api/types';

export interface Filters {
  search: string;
  status: '' | TaskStatus;
  typeId: string;
}

export const EMPTY_FILTERS: Filters = { search: '', status: '', typeId: '' };

export function filterTasks(tasks: Task[], f: Filters) {
  const q = f.search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (!q || t.title.toLowerCase().includes(q) || (t.user?.name ?? '').toLowerCase().includes(q)) &&
      (!f.status || t.status === f.status) &&
      (!f.typeId || String(t.task_type_id) === f.typeId),
  );
}

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
  types: TaskType[];
}

export default function TaskFilters({ value, onChange, types }: Props) {
  return (
    <section className="filters">
      <div className="container filters-grid">
        <div>
          <label className="label">Buscar tarea</label>
          <input
            className="input"
            placeholder="Ej. Ensayo, taller…"
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Estado</label>
          <select
            className="select"
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value as Filters['status'] })}
          >
            <option value="">Todos los estados</option>
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tipo</label>
          <select
            className="select"
            value={value.typeId}
            onChange={(e) => onChange({ ...value, typeId: e.target.value })}
          >
            <option value="">Todos los tipos</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn outline pill" onClick={() => onChange(EMPTY_FILTERS)}>
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
