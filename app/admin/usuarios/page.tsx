"use client";

import { useState } from "react";

// /admin/usuarios — Gestión de usuarios y Puntos Kiori (kiori_spec.md §12).
const INITIAL = [
  { id: "1", name: "Ana Robles", email: "ana@correo.mx", sub: "Activa", puntos: 150, ref: "KIORI-A1B2C" },
  { id: "2", name: "Luz Fernández", email: "luz@correo.mx", sub: "Ninguna", puntos: 0, ref: "KIORI-9X8Y7" },
  { id: "3", name: "Mar Gómez", email: "mar@correo.mx", sub: "Cancelada", puntos: 300, ref: "KIORI-QW3RT" },
];

export default function AdminUsuarios() {
  const [users, setUsers] = useState(INITIAL);

  function adjust(id: string, delta: number) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, puntos: Math.max(0, x.puntos + delta) } : x)));
  }

  return (
    <div>
      <h1 className="admin-h1">Usuarios</h1>
      <table className="adm-table">
        <thead><tr><th>Nombre</th><th>Correo</th><th>Suscripción</th><th>Código referido</th><th>Puntos Kiori</th><th>Ajustar</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`adm-badge ${u.sub === "Activa" ? "green" : ""}`}>{u.sub}</span></td>
              <td><code>{u.ref}</code></td>
              <td><strong>{u.puntos}</strong></td>
              <td>
                <button className="adm-btn" onClick={() => adjust(u.id, 50)}>+50</button>
                <button className="adm-btn" onClick={() => adjust(u.id, -50)}>−50</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: ".82rem", marginTop: "1rem" }}>
        Al ajustar puntos se solicita una nota interna de justificación (kiori_spec.md §11).
      </p>
    </div>
  );
}
