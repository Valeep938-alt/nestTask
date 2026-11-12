"use client";

import { STATUS_LABELS, type TaskStatus, type TaskType } from "../types";
import { EMPTY_FILTERS, type TaskFiltersState } from "../utils";

interface TaskFiltersProps {
  value: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  types: TaskType[];
}

export function TaskFilters({ value, onChange, types }: TaskFiltersProps) {
  return (
    <section className="filters">
      <div className="container filters-grid">
        <div>
          <label className="label" htmlFor="filter-search">
            Buscar tarea
          </label>
          <input
            id="filter-search"
            className="input"
            placeholder="Ej. Ensayo, taller…"
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="filter-status">
            Estado
          </label>
          <select
            id="filter-status"
            className="select"
            value={value.status}
            onChange={(e) =>
              onChange({
                ...value,
                status: e.target.value as TaskFiltersState["status"],
              })
            }
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
          <label className="label" htmlFor="filter-type">
            Tipo
          </label>
          <select
            id="filter-type"
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

        <button
          className="btn outline pill"
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
