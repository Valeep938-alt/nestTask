"use client";

import { AppShell } from "@/layouts/AppShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="auth-wrap">
        <RegisterForm />
      </div>
    </AppShell>
  );
}
