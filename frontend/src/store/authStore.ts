"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { queryClient } from "@/lib/queryClient";
import type { Usuario } from "@/features/auth/types";

interface AuthState {
  token: string | null;
  user: Usuario | null;
  verificando: boolean;

  setSesion: (token: string, user: Usuario) => void;
  logout: () => void;
  setVerificando: (v: boolean) => void;
}

function limpiarCacheDeSesion() {
  queryClient.clear();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      verificando: false,

      setSesion: (token, user) => {
        limpiarCacheDeSesion();
        set({ token, user, verificando: false });
      },

      logout: () => {
        limpiarCacheDeSesion();
        set({ token: null, user: null, verificando: false });
      },

      setVerificando: (v) => set({ verificando: v }),
    }),
    {
      name: "tareas-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
