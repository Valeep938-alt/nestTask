import { axiosClient } from "../config/axiosClient";
import type { Task, NewTask, UpdateTask } from "@/features/tasks/types";
import type { ApiMessageResponse } from "@/types";

export const tasksService = {
  list: () => axiosClient.get<Task[]>("/tasks").then((res) => res.data),

  get: (id: string) =>
    axiosClient.get<Task>(`/tasks/${id}`).then((res) => res.data),

  create: (body: NewTask) =>
    axiosClient.post<Task>("/tasks", body).then((res) => res.data),

  update: (id: string, body: UpdateTask) =>
    axiosClient.patch<Task>(`/tasks/${id}`, body).then((res) => res.data),

  updateStatus: (id: string, status: UpdateTask["status"]) =>
    axiosClient.patch<Task>(`/tasks/${id}`, { status }).then((res) => res.data),

  remove: (id: string) =>
    axiosClient
      .delete<ApiMessageResponse>(`/tasks/${id}`)
      .then((res) => res.data),
};
