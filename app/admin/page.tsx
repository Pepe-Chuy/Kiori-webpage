"use client";

import Link from "next/link";

// /admin — Dashboard principal (kiori_spec.md §12).
const STATS = [
  { n: "24", l: "Pedidos del mes" },
  { n: "18", l: "Suscriptoras activas" },
  { n: "30", l: "Productos" },
  { n: "3", l: "Devoluciones pendientes" },
];

const SHORTCUTS = [
  { href: "/admin/pedidos", label: "Gestionar pedidos", desc: "Revisa estados y rastreo de envíos." },
  { href: "/admin/paquetes", label: "Cajas mensuales", desc: "Prepara y envía los paquetes de suscripción." },
  { href: "/admin/productos", label: "Productos", desc: "Crea, edita y restockea el catálogo." },
  { href: "/admin/clases", label: "Clases", desc: "Publica u oculta clases en línea." },
  { href: "/admin/usuarios", label: "Usuarios", desc: "Administra cuentas y Puntos Kiori." },
  { href: "/admin/devoluciones", label: "Devoluciones", desc: "Aprueba o rechaza solicitudes." },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="admin-h1">Dashboard</h1>
      <div className="stat-grid">
        {STATS.map((s) => (
          <div key={s.l} className="stat"><div className="n">{s.n}</div><div className="l">{s.l}</div></div>
        ))}
      </div>

      <h2 className="admin-h2">Accesos rápidos</h2>
      <div className="stat-grid">
        {SHORTCUTS.map((s) => (
          <Link key={s.href} href={s.href} className="stat" style={{ display: "block" }}>
            <div style={{ color: "var(--color-sage)", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: ".4rem" }}>{s.label}</div>
            <div className="muted" style={{ fontSize: ".85rem", lineHeight: 1.5 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
