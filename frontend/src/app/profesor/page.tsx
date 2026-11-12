"use client";

import { useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { TeacherTasksPanel } from "@/features/tasks/components/TeacherTasksPanel";
import { TaskTypesPanel } from "@/features/tasks/components/TaskTypesPanel";

type Tab = "tareas" | "tipos";

export default function ProfesorPage() {
  const [tab, setTab] = useState<Tab>("tareas");

  return (
    <AppShell>
      <AuthGuard roles={["profesor"]}>
        <div className="container page" style={{ paddingBottom: 0 }}>
          <p className="eyebrow">Panel · Profesor</p>
          <h1 className="title sm">
            Gestiona <em>tareas</em> y estudiantes.
          </h1>
          <div className="tabs">
            <button
              className={"tab" + (tab === "tareas" ? " active" : "")}
              onClick={() => setTab("tareas")}
            >
              Tareas
            </button>
            <button
              className={"tab" + (tab === "tipos" ? " active" : "")}
              onClick={() => setTab("tipos")}
            >
              Tipos de tarea
            </button>
          </div>
        </div>

        {tab === "tareas" ? <TeacherTasksPanel /> : <TaskTypesPanel />}
      </AuthGuard>
    </AppShell>
  );
}
