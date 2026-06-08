"use client";

import { useState } from "react";

// /admin/devoluciones — Gestión de solicitudes de devolución (kiori_spec.md §12).
const INITIAL = [
  { id: "r1", order: "#1024", user: "ana@correo.mx", reason: "Llegó dañado el cuarzo.", status: "pendiente" },
  { id: "r2", order: "#1009", user: "luz@correo.mx", reason: "Producto equivocado.", status: "pendiente" },
  { id: "r3", order: "#0998", user: "mar@correo.mx", reason: "No era lo esperado.", status: "rechazada" },
];

export default function AdminDevoluciones() {
  const [returns, setReturns] = useState(INITIAL);

  function resolve(id: string, status: string) {
    setReturns((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <div>
      <h1 className="admin-h1">Devoluciones</h1>
      <table className="adm-table">
        <thead><tr><th>Pedido</th><th>Usuaria</th><th>Motivo</th><th>Estado</th><th>Resolución</th></tr></thead>
        <tbody>
          {returns.map((r) => (
            <tr key={r.id}>
              <td>{r.order}</td>
              <td>{r.user}</td>
              <td style={{ maxWidth: 260 }}>{r.reason}</td>
              <td>
                <span className={`adm-badge ${r.status === "aprobada" ? "green" : r.status === "rechazada" ? "nude" : ""}`}>
                  {r.status}
                </span>
              </td>
              <td>
                {r.status === "pendiente" ? (
                  <>
                    <button className="adm-btn solid" onClick={() => resolve(r.id, "aprobada")}>Aprobar (reenvío)</button>
                    <button className="adm-btn" onClick={() => resolve(r.id, "aprobada")}>Aprobar (puntos)</button>
                    <button className="adm-btn" onClick={() => resolve(r.id, "rechazada")}>Rechazar</button>
                  </>
                ) : (
                  <span className="muted" style={{ fontSize: ".82rem" }}>Notificación enviada por email</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
