"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionStatus: string;
  subscriptionTier: string | null;
  puntosKiori: number;
  referralCode: string;
}

export default function AdminUsuarios() {
  const [users, setUsers]     = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setUsers(data.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email ?? "—",
        role: p.role,
        subscriptionStatus: p.subscription_status,
        subscriptionTier: p.subscription_tier,
        puntosKiori: p.puntos_kiori,
        referralCode: p.referral_code ?? "—",
      })));
    }
    setLoading(false);
  }

  async function adjustPoints(id: string, delta: number) {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const next = Math.max(0, user.puntosKiori + delta);
    await supabase.from("profiles").update({ puntos_kiori: next }).eq("id", id);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, puntosKiori: next } : u));
  }

  async function toggleRole(id: string, current: string) {
    const next = current === "admin" ? "user" : "admin";
    if (!confirm(`¿Cambiar rol a "${next}"?`)) return;
    await supabase.from("profiles").update({ role: next }).eq("id", id);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: next } : u));
  }

  const subLabel = (u: AdminUser) => {
    if (u.subscriptionStatus === "active") return u.subscriptionTier ?? "Activa";
    if (u.subscriptionStatus === "canceled") return "Cancelada";
    if (u.subscriptionStatus === "paused") return "Pausada";
    return "Ninguna";
  };

  return (
    <div>
      <h1 className="admin-h1">Usuarios</h1>
      {loading ? (
        <p className="muted">Cargando usuarios…</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Suscripción</th>
              <th>Código referido</th>
              <th>Puntos Kiori</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`adm-badge ${u.role === "admin" ? "nude" : ""}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`adm-badge ${u.subscriptionStatus === "active" ? "green" : ""}`}>
                    {subLabel(u)}
                  </span>
                </td>
                <td><code>{u.referralCode}</code></td>
                <td><strong>{u.puntosKiori}</strong></td>
                <td>
                  <button className="adm-btn" onClick={() => adjustPoints(u.id, 50)}>+50 pts</button>
                  <button className="adm-btn" onClick={() => adjustPoints(u.id, -50)}>−50 pts</button>
                  <button className="adm-btn" onClick={() => toggleRole(u.id, u.role)}>
                    {u.role === "admin" ? "→ user" : "→ admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="muted" style={{ fontSize: ".82rem", marginTop: "1rem" }}>
        {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}.
      </p>
    </div>
  );
}
