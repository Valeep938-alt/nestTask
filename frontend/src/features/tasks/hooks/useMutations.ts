"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksService } from "@/api/services/tasksService";
import { taskTypesService } from "@/api/services/taskTypesService";
import type { NewTask, UpdateTask } from "../types";
import type {
  CreateTaskFormData,
  CreateTaskTypeFormData,
  UpdateTaskFormData,
} from "../schemas";

function toNewTaskBody(data: CreateTaskFormData): NewTask {
  const body: NewTask = { user_id: data.user_id, title: data.title.trim() };
  if (data.description?.trim()) body.description = data.description.trim();
  if (data.due_date) body.due_date = data.due_date;
  if (data.task_type_id) body.task_type_id = Number(data.task_type_id);
  return body;
}

function toUpdateTaskBody(data: UpdateTaskFormData): UpdateTask {
  return {
    title: data.title.trim(),
    user_id: data.user_id,
    status: data.status,
    description: data.description?.trim() || null,
    due_date: data.due_date || null,
    task_type_id: data.task_type_id ? Number(data.task_type_id) : null,
  };
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskFormData) =>
      tasksService.create(toNewTaskBody(data)),
    onSuccess: () => {
      toast.success("Tarea asignada");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskFormData }) =>
      tasksService.update(id, toUpdateTaskBody(data)),
    onSuccess: () => {
      toast.success("Tarea actualizada");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: UpdateTask["status"];
    }) => tasksService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksService.remove(id),
    onSuccess: () => {
      toast.success("Tarea eliminada");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCreateTaskType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskTypeFormData) =>
      taskTypesService.create({
        name: data.name.trim(),
        description: data.description?.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Tipo creado");
      qc.invalidateQueries({ queryKey: ["task-types"] });
    },
  });
}

export function useDeleteTaskType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => taskTypesService.remove(id),
    onSuccess: () => {
      toast.success("Tipo eliminado");
      qc.invalidateQueries({ queryKey: ["task-types"] });
    },
  });
}
