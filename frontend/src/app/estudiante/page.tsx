"use client";

import { AppShell } from "@/layouts/AppShell";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { useAuthStore } from "@/store/authStore";
import { StudentTasksPanel } from "@/features/tasks/components/StudentTasksPanel";

export default function EstudiantePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppShell>
      <AuthGuard roles={["estudiante"]}>
        <div className="container page" style={{ paddingBottom: 0 }}>
          <p className="eyebrow">Espacio · Estudiante</p>
          <h1 className="title sm">
            Hola, {user?.name}. Estas son tus <em>tareas</em>.
          </h1>
        </div>
        <StudentTasksPanel />
      </AuthGuard>
    </AppShell>
  );
}
