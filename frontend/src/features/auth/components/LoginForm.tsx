"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="auth-card"
      onSubmit={handleSubmit((data) => login.mutate(data))}
      noValidate
    >
      <p className="eyebrow">Acceso</p>
      <h1 className="title">
        Bienvenido <em>de nuevo</em>.
      </h1>

      {login.isError && (
        <div className="alert">{getApiErrorMessage(login.error)}</div>
      )}

      <div className="field">
        <label className="label" htmlFor="login-email">
          Correo
        </label>
        <input
          id="login-email"
          className="input"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label className="label" htmlFor="login-password">
          Contraseña
        </label>
        <input
          id="login-password"
          className="input"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="field-error">{errors.password.message}</p>
        )}
      </div>

      <button
        className="btn"
        style={{ width: "100%" }}
        disabled={login.isPending}
      >
        {login.isPending ? "Entrando…" : "Acceder"}
      </button>

      <p className="card-meta" style={{ marginTop: "1.2rem" }}>
        ¿No tienes cuenta?{" "}
        <Link href="/registro" style={{ textDecoration: "underline" }}>
          Regístrate
        </Link>
      </p>
    </form>
  );
}
