"use client";

import Link from "next/link";
import { AppShell } from "@/layouts/AppShell";
import { useAuthStore } from "@/store/authStore";
import { homePathFor } from "@/features/auth/utils/homePath";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppShell>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Espacio académico · 2026</p>
          <h1 className="title">
            Tareas claras para <em>aprender</em> mejor.
          </h1>

          <div className="hero-bottom">
            <p className="lead">
              El profesor crea y asigna tareas; cada estudiante ve las suyas al
              iniciar sesión y actualiza su avance.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link className="btn" href={homePathFor(user.role)}>
                  Ir a mi espacio
                </Link>
              ) : (
                <>
                  <Link className="btn" href="/login">
                    Acceder
                  </Link>
                  <Link className="btn outline" href="/registro">
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
