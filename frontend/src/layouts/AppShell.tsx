"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useIsHydrated } from "@/lib/useIsHydrated";
import { applyTheme } from "@/lib/theme";
import { BRAND } from "@/config/brand";
import { homePathFor } from "@/features/auth/utils/homePath";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const themeId = useUiStore((s) => s.themeId);
  const setTheme = useUiStore((s) => s.setTheme);
  const hidratado = useIsHydrated();

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  const sesion = hidratado && token && user ? user : null;

  return (
    <div className="shell">
      <Navbar
        brandName={BRAND.name}
        brandSuffix={BRAND.suffix}
        panelHref={sesion ? homePathFor(sesion.role) : undefined}
        panelLabel={
          sesion
            ? sesion.role === "profesor"
              ? "Panel"
              : "Mis tareas"
            : undefined
        }
        userName={sesion?.name ?? null}
        onLogout={handleLogout}
        rightExtra={
          <ThemeSwitcher
            value={hidratado ? themeId : "studio"}
            onChange={setTheme}
          />
        }
      />
      <main>{children}</main>
    </div>
  );
}
