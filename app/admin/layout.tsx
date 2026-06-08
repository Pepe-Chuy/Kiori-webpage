"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

// Layout del panel de administración (kiori_spec.md §12).
// NOTA: en producción las rutas /admin/* se protegen con middleware de Next.js
// validando el rol del JWT de NextAuth. Aquí se usa un guard de cliente (mock).
const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/paquetes", label: "Paquetes" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/clases", label: "Clases" },
  { href: "/admin/devoluciones", label: "Devoluciones" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/iniciar-sesion?redirect=/admin");
    else if (user.role !== "admin") router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user || user.role !== "admin") {
    return <div className="page" style={{ display: "grid", placeItems: "center" }}>
      <p className="muted">Verificando acceso de administrador…</p>
    </div>;
  }

  return (
    <div className="page" style={{ paddingTop: 76 }}>
      <div className="admin-shell">
        <aside className="admin-side">
          <p className="admin-brand">Panel Kiori</p>
          {ADMIN_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={`asidelink ${active ? "active" : ""}`}>
                {l.label}
              </Link>
            );
          })}
        </aside>
        <main className="admin-main">{children}</main>
      </div>

      <style jsx>{`
        .admin-shell { display: grid; grid-template-columns: 230px 1fr; min-height: calc(100vh - 76px); }
        .admin-side { background: var(--color-sage); padding: 2rem 1.2rem; display: flex; flex-direction: column; gap: .3rem; }
        .admin-brand { color: var(--color-blush); font-family: var(--font-display); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 1.2rem; font-size: .9rem; }
        .asidelink { color: rgba(237,230,233,.85); padding: .65rem .9rem; border-radius: 10px; font-size: .92rem; transition: background .2s ease; }
        .asidelink:hover { background: rgba(255,255,255,.1); }
        .asidelink.active { background: var(--color-rose); color: var(--color-sage); font-weight: 700; }
        .admin-main { padding: clamp(1.5rem, 4vw, 3rem); background: var(--color-blush); }
        @media (max-width: 820px) {
          .admin-shell { grid-template-columns: 1fr; }
          .admin-side { flex-direction: row; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
