export type TaskStatus = "pending" | "in_progress" | "done" | "cancelled";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Completada",
  cancelled: "Cancelada",
};

export interface TaskType {
  id: number;
  name: string;
  description: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  user_id: string;
  user?: { id: string; name: string; email: string };
  task_type_id: number | null;
  task_type: TaskType | null;
  created_at: string;
}

export interface NewTask {
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  task_type_id?: number;
}

export interface UpdateTask {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  due_date?: string | null;
  task_type_id?: number | null;
  user_id?: string;
}
