"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/api/services/tasksService";
import { taskTypesService } from "@/api/services/taskTypesService";
import { usersService } from "@/api/services/usersService";
import { useAuthStore } from "@/store/authStore";

export function useTasks() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  return useQuery({
    queryKey: ["tasks", userId],
    queryFn: tasksService.list,
    enabled: userId !== null,
  });
}

export function useTaskTypes() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  return useQuery({
    queryKey: ["task-types", userId],
    queryFn: taskTypesService.list,
    staleTime: 5 * 60_000,
    enabled: userId !== null,
  });
}

export function useStudents() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  return useQuery({
    queryKey: ["students", userId],
    queryFn: usersService.students,
    staleTime: 5 * 60_000,
    enabled: userId !== null,
  });
}
