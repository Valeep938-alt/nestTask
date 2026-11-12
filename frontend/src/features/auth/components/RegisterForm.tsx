"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/api/config/axiosClient";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <form
      className="auth-card"
      onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
      noValidate
    >
      <p className="eyebrow">Nueva cuenta · Estudiante</p>
      <h1 className="title">
        Crea tu <em>cuenta</em>.
      </h1>

      {registerMutation.isError && (
        <div className="alert">
          {getApiErrorMessage(registerMutation.error)}
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor="reg-name">
          Nombre
        </label>
        <input
          id="reg-name"
          className="input"
          autoComplete="name"
          placeholder="Tu nombre"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label className="label" htmlFor="reg-email">
          Correo
        </label>
        <input
          id="reg-email"
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
        <label className="label" htmlFor="reg-password">
          Contraseña
        </label>
        <input
          id="reg-password"
          className="input"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
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
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creando…" : "Registrarme"}
      </button>

      <p className="card-meta" style={{ marginTop: "1.2rem" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" style={{ textDecoration: "underline" }}>
          Accede
        </Link>
      </p>
    </form>
  );
}
