"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

// Formularios de autenticación (mock; en producción NextAuth.js, §6).
// Soportan ?redirect para volver al carrito tras crear cuenta / iniciar sesión.

function AuthShell({ title, accent, children, footer }: { title: string; accent: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="page" style={{ display: "flex" }}>
      <div className="auth-wrap">
        <div className="auth-visual">
          <img src="/landing/logo-white.png" alt="Kiori" className="auth-logo" />
          <p className="auth-tag">Energía que inspira</p>
        </div>
        <div className="auth-form-side">
          <h1 className="auth-title">{title} <span className="italic-accent">{accent}</span></h1>
          {children}
          <div className="auth-footer">{footer}</div>
        </div>
      </div>
      <style jsx>{`
        .auth-wrap {
          display: grid; grid-template-columns: 1fr 1.1fr; width: 100%; min-height: calc(100vh - 76px);
        }
        .auth-visual {
          background: var(--color-sage); color: var(--color-blush);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 2rem;
        }
        .auth-logo { height: 90px; width: auto; }
        .auth-tag { font-style: italic; letter-spacing: .04em; opacity: .9; }
        .auth-form-side { display: flex; flex-direction: column; justify-content: center; padding: clamp(2rem, 6vw, 5rem); max-width: 560px; }
        .auth-title { font-size: clamp(1.8rem, 4vw, 2.8rem); color: var(--color-sage); margin-bottom: 2rem; }
        .auth-title .italic-accent { font-size: inherit; }
        .auth-footer { margin-top: 1.5rem; font-size: .9rem; color: var(--color-ink); }
        @media (max-width: 768px) { .auth-wrap { grid-template-columns: 1fr; } .auth-visual { min-height: 200px; } }
      `}</style>
    </div>
  );
}

export function LoginForm({ redirect }: { redirect?: string }) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await login(String(data.get("email")), String(data.get("password")));
    if (!res.ok) return setError(res.error);
    router.push(redirect || "/perfil");
  }

  return (
    <AuthShell
      title="Iniciar"
      accent="sesión"
      footer={<>¿Aún no tienes cuenta? <Link href={`/registrarse${redirect ? `?redirect=${redirect}` : ""}`} style={{ color: "var(--color-sage)", fontWeight: 700 }}>Regístrate</Link></>}
    >
      <form onSubmit={onSubmit}>
        <div className="field-group"><label>Correo</label><input name="email" type="email" required /></div>
        <div className="field-group"><label>Contraseña</label><input name="password" type="password" required /></div>
        {error && <p style={{ color: "#b00", fontSize: ".85rem" }}>{error}</p>}
        <button type="submit" className="btn-pill btn-nude" style={{ width: "100%", marginTop: ".5rem" }}>Entrar</button>
        <button type="button" className="btn-pill btn-outline" style={{ width: "100%", marginTop: ".7rem" }}>
          Continuar con Google
        </button>
        <p className="muted" style={{ fontSize: ".78rem", marginTop: "1rem" }}>
          Demo: usa cualquier correo. Para el panel admin entra con <strong>admin@kiori.mx</strong>.
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterForm({ redirect }: { redirect?: string }) {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("password") !== data.get("password2")) return setError("Las contraseñas no coinciden.");
    const res = await register({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password: String(data.get("password")),
      referralCode: String(data.get("referral") || ""),
    });
    if (!res.ok) return setError(res.error);
    router.push(redirect || "/perfil");
  }

  return (
    <AuthShell
      title="Únete a la"
      accent="comunidad Kiori"
      footer={<>¿Ya tienes cuenta? <Link href={`/iniciar-sesion${redirect ? `?redirect=${redirect}` : ""}`} style={{ color: "var(--color-sage)", fontWeight: 700 }}>Inicia sesión</Link></>}
    >
      <form onSubmit={onSubmit}>
        <div className="field-group"><label>Nombre</label><input name="name" type="text" required /></div>
        <div className="field-group"><label>Correo</label><input name="email" type="email" required /></div>
        <div className="field-group"><label>Contraseña</label><input name="password" type="password" required /></div>
        <div className="field-group"><label>Repetir contraseña</label><input name="password2" type="password" required /></div>
        <div className="field-group"><label>Código de referido (opcional)</label><input name="referral" type="text" placeholder="KIORI-XXXXX" /></div>
        {error && <p style={{ color: "#b00", fontSize: ".85rem" }}>{error}</p>}
        <button type="submit" className="btn-pill btn-nude" style={{ width: "100%", marginTop: ".5rem" }}>Crear cuenta</button>
        <button type="button" className="btn-pill btn-outline" style={{ width: "100%", marginTop: ".7rem" }}>
          Registrarme con Google
        </button>
      </form>
    </AuthShell>
  );
}
