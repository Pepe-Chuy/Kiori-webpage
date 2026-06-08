"use client";

// Contexto de autenticación.
// NOTA: implementación mock basada en localStorage para el frontend actual.
// En producción se reemplaza por NextAuth.js (kiori_spec.md §6) manteniendo
// la misma interfaz (user, login, logout, register).

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SessionUser } from "@/lib/types";

interface AuthContextValue {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; referralCode?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  // Activa una suscripción de demo (en producción: Stripe Subscriptions).
  activateSubscription: (tier: "mensual" | "trimestral" | "anual") => void;
  cancelSubscription: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "kiori_session";

// Genera un código de referido KIORI-XXXXX (§6).
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `KIORI-${code}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  // Restaura sesión persistida al montar.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  function persist(next: SessionUser | null) {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async function login(email: string, password: string) {
    if (!email || !password) return { ok: false, error: "Ingresa correo y contraseña." };
    // Demo: cualquier credencial válida crea sesión. admin@kiori.mx => rol admin.
    const isAdmin = email.trim().toLowerCase() === "admin@kiori.mx";
    persist({
      id: "u_" + btoa(email).slice(0, 8),
      name: email.split("@")[0],
      email,
      role: isAdmin ? "admin" : "user",
      puntosKiori: 150,
      referralCode: generateReferralCode(),
      subscriptionStatus: "none",
      subscriptionTier: null,
    });
    return { ok: true };
  }

  async function register(data: { name: string; email: string; password: string; referralCode?: string }) {
    if (!data.name || !data.email || !data.password) {
      return { ok: false, error: "Completa todos los campos." };
    }
    persist({
      id: "u_" + btoa(data.email).slice(0, 8),
      name: data.name,
      email: data.email,
      role: data.email.trim().toLowerCase() === "admin@kiori.mx" ? "admin" : "user",
      puntosKiori: 0,
      referralCode: generateReferralCode(),
      subscriptionStatus: "none",
      subscriptionTier: null,
    });
    return { ok: true };
  }

  function logout() {
    persist(null);
  }

  function activateSubscription(tier: "mensual" | "trimestral" | "anual") {
    if (!user) return;
    persist({ ...user, subscriptionStatus: "active", subscriptionTier: tier });
  }

  function cancelSubscription() {
    if (!user) return;
    persist({ ...user, subscriptionStatus: "canceled" });
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, activateSubscription, cancelSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
