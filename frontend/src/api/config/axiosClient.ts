import axios, { AxiosError, isAxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import type { NestApiErrorBody } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

let redirigiendoALogin = false;

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<NestApiErrorBody>) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const esLogin = url.includes("/auth/login");

    if (status === 401 && !esLogin && !redirigiendoALogin) {
      redirigiendoALogin = true;
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }

      setTimeout(() => {
        redirigiendoALogin = false;
      }, 1000);
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<NestApiErrorBody>(error)) {
    const raw = error.response?.data?.message;

    if (Array.isArray(raw)) return raw.join(" · ");
    if (typeof raw === "string" && raw) return raw;

    if (error.code === "ECONNABORTED")
      return "El servidor tardó demasiado en responder";
    if (!error.response) return "No se pudo conectar con el servidor";
    return `Error ${error.response.status} del servidor`;
  }
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}
