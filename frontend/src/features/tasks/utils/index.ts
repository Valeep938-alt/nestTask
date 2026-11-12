import type { Task, TaskType } from "../types";

export interface TaskFiltersState {
  search: string;
  status: "" | Task["status"];
  typeId: string;
}

export const EMPTY_FILTERS: TaskFiltersState = {
  search: "",
  status: "",
  typeId: "",
};

export function filterTasks(tasks: Task[], f: TaskFiltersState): Task[] {
  const q = f.search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (!q ||
        t.title.toLowerCase().includes(q) ||
        (t.user?.name ?? "").toLowerCase().includes(q)) &&
      (!f.status || t.status === f.status) &&
      (!f.typeId || String(t.task_type_id) === f.typeId),
  );
}

export function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

export function typesToOptions(types: TaskType[]) {
  return types.map((t) => ({ value: String(t.id), label: t.name }));
}
