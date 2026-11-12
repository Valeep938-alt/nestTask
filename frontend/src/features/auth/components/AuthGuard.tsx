"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useIsHydrated } from "@/lib/useIsHydrated";
import { homePathFor } from "../utils/homePath";
import type { Role } from "../types";

interface AuthGuardProps {
  roles: Role[];
  children: ReactNode;
}

export function AuthGuard({ roles, children }: AuthGuardProps) {
  const router = useRouter();
  const hidratado = useIsHydrated();
  const { token, user, verificando } = useAuthStore();

  useEffect(() => {
    if (!hidratado) return;
    if (!token || !user) {
      router.replace("/login");
    } else if (!roles.includes(user.role)) {
      router.replace(homePathFor(user.role));
    }
  }, [hidratado, token, user, roles, router]);

  if (
    !hidratado ||
    verificando ||
    !token ||
    !user ||
    !roles.includes(user.role)
  ) {
    return <p className="container page muted">Cargando…</p>;
  }

  return <>{children}</>;
}
