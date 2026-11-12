import { axiosClient } from "../config/axiosClient";
import type { AuthResponse, MeResponse, Usuario } from "@/features/auth/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    axiosClient
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => res.data),

  register: (payload: RegisterPayload) =>
    axiosClient
      .post<Usuario>("/auth/register", payload)
      .then((res) => res.data),

  me: () => axiosClient.get<MeResponse>("/auth/me").then((res) => res.data),
};
