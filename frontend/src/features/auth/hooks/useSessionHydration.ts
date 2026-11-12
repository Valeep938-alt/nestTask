"use client";

import { useEffect } from "react";
import { authService } from "@/api/services/authService";
import { useAuthStore } from "@/store/authStore";

export function useSessionHydration() {
  const token = useAuthStore((s) => s.token);
  const setVerificando = useAuthStore((s) => s.setVerificando);

  useEffect(() => {
    if (!token) return;

    let cancelado = false;
    setVerificando(true);

    authService
      .me()
      .catch(() => {})
      .finally(() => {
        if (!cancelado) setVerificando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);
}
