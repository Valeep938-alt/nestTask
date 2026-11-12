"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { LoginFormData } from "../schemas/loginSchema";
import { homePathFor } from "../utils/homePath";

export function useLogin() {
  const router = useRouter();
  const setSesion = useAuthStore((s) => s.setSesion);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const auth = await authService.login(data);
      setSesion(auth.access_token, auth.user);
      return auth;
    },
    onSuccess: (auth) => {
      router.push(homePathFor(auth.user.role));
    },
  });
}
