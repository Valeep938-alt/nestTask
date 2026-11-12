"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { RegisterFormData } from "../schemas/registerSchema";

export function useRegister() {
  const router = useRouter();
  const setSesion = useAuthStore((s) => s.setSesion);

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      await authService.register(data);

      const auth = await authService.login({
        email: data.email,
        password: data.password,
      });

      setSesion(auth.access_token, auth.user);

      return auth;
    },
    onSuccess: (auth) => {
      const dest = auth.user.role === "profesor" ? "/profesor" : "/estudiante";
      router.push(dest);
    },
  });
}
