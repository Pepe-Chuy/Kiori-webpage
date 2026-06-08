"use client";

// /admin/pedidos — Gestión de pedidos de tienda (kiori_spec.md §12).
const ORDERS = [
  { id: "#1024", user: "ana@correo.mx", total: 648, status: "Entregado", track: "ENV-99182", cls: "green" },
  { id: "#1031", user: "luz@correo.mx", total: 299, status: "Enviado", track: "ENV-99240", cls: "nude" },
  { id: "#1033", user: "mar@correo.mx", total: 1290, status: "Procesando", track: "—", cls: "" },
  { id: "#1035", user: "sol@correo.mx", total: 459, status: "Pendiente", track: "—", cls: "" },
];

export default function AdminPedidos() {
  return (
    <div>
      <h1 className="admin-h1">Pedidos</h1>
      <table className="adm-table">
        <thead><tr><th>Pedido</th><th>Usuaria</th><th>Total</th><th>Estado</th><th>Rastreo</th><th>Acciones</th></tr></thead>
        <tbody>
          {ORDERS.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>${o.total}</td>
              <td><span className={`adm-badge ${o.cls}`}>{o.status}</span></td>
              <td>{o.track}</td>
              <td><button className="adm-btn">Ver detalle</button><button className="adm-btn">Actualizar estado</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
