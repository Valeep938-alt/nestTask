import { api } from './client';
import { AuthResponse, NewTask, Role, Task, TaskStatus, TaskType, User } from './types';

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name: string, email: string, password: string) =>
    api<User>('/auth/register', { method: 'POST', body: { name, email, password } }),
  me: () => api<{ id: string; email: string; role: Role }>('/auth/me'),
};

export const usersApi = {
  students: () => api<User[]>('/users?role=estudiante'),
};

export const taskTypesApi = {
  list: () => api<TaskType[]>('/task-types'),
  create: (body: { name: string; description?: string }) =>
    api<TaskType>('/task-types', { method: 'POST', body }),
  remove: (id: number) => api<{ message: string }>(`/task-types/${id}`, { method: 'DELETE' }),
};

export const tasksApi = {
  list: () => api<Task[]>('/tasks'),
  create: (body: NewTask) => api<Task>('/tasks', { method: 'POST', body }),
  updateStatus: (id: string, status: TaskStatus) =>
    api<Task>(`/tasks/${id}`, { method: 'PATCH', body: { status } }),
  remove: (id: string) => api<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
};
