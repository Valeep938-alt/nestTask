"use client";

import { AppShell } from "@/layouts/AppShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="auth-wrap">
        <LoginForm />
      </div>
    </AppShell>
  );
}
