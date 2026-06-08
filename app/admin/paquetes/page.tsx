"use client";

// /admin/paquetes — Cajas mensuales de suscripción (kiori_spec.md §12).
const PACKAGES = [
  { user: "Ana Robles", month: "2026-06", items: "Cuarzo Rosa, Vela de Meditación, Aceite de Lavanda", status: "Empacando", cls: "nude" },
  { user: "Mar Gómez", month: "2026-06", items: "Amatista Bruta, Sahumerio de Salvia", status: "Pendiente", cls: "" },
  { user: "Sol Díaz", month: "2026-05", items: "Set de Mindfulness, Incienso de Palo Santo", status: "Enviado", cls: "green" },
];

export default function AdminPaquetes() {
  return (
    <div>
      <h1 className="admin-h1">Paquetes mensuales</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Contenido sugerido por el sistema según las preferencias de cada usuaria. Confirma y marca el estado.
      </p>
      <table className="adm-table">
        <thead><tr><th>Usuaria</th><th>Mes</th><th>Contenido recomendado</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {PACKAGES.map((p, i) => (
            <tr key={i}>
              <td>{p.user}</td>
              <td>{p.month}</td>
              <td style={{ maxWidth: 320 }}>{p.items}</td>
              <td><span className={`adm-badge ${p.cls}`}>{p.status}</span></td>
              <td><button className="adm-btn">Editar contenido</button><button className="adm-btn solid">Marcar enviado</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
