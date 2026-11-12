"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId } from "@/lib/theme";

interface UiState {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themeId: "studio",
      setTheme: (id) => set({ themeId: id }),
    }),
    { name: "tareas-theme" },
  ),
);
