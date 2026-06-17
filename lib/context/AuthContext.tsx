"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SessionUser } from "@/lib/types";

interface AuthContextValue {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; referralCode?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  activateSubscription: (tier: "mensual" | "trimestral" | "anual") => void;
  cancelSubscription: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string
): Promise<SessionUser | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!data) return null;

  return {
    id: userId,
    name: data.name,
    email,
    role: data.role,
    puntosKiori: data.puntos_kiori,
    referralCode: data.referral_code,
    subscriptionStatus: data.subscription_status,
    subscriptionTier: data.subscription_tier,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(supabase, session.user.id, session.user.email!);
        setUser(profile);
      }
      setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(supabase, session.user.id, session.user.email!);
          setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
  }) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  function logout() {
    supabase.auth.signOut();
  }

  async function activateSubscription(tier: "mensual" | "trimestral" | "anual") {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ subscription_status: "active", subscription_tier: tier })
      .eq("id", user.id);
    setUser({ ...user, subscriptionStatus: "active", subscriptionTier: tier });
  }

  async function cancelSubscription() {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ subscription_status: "canceled" })
      .eq("id", user.id);
    setUser({ ...user, subscriptionStatus: "canceled" });
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
