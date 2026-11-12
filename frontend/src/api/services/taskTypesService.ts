import { axiosClient } from "../config/axiosClient";
import type { TaskType } from "@/features/tasks/types";
import type { ApiMessageResponse } from "@/types";

export interface CreateTaskTypePayload {
  name: string;
  description?: string | null;
}

export interface UpdateTaskTypePayload {
  name?: string;
  description?: string | null;
}

export const taskTypesService = {
  list: () =>
    axiosClient.get<TaskType[]>("/task-types").then((res) => res.data),

  create: (body: CreateTaskTypePayload) =>
    axiosClient.post<TaskType>("/task-types", body).then((res) => res.data),

  update: (id: number, body: UpdateTaskTypePayload) =>
    axiosClient
      .patch<TaskType>(`/task-types/${id}`, body)
      .then((res) => res.data),

  remove: (id: number) =>
    axiosClient
      .delete<ApiMessageResponse>(`/task-types/${id}`)
      .then((res) => res.data),
};
