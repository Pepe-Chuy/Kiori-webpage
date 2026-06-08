"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";

// Navbar global (kiori_spec.md §14). Transparente sobre el hero del landing,
// sólida al hacer scroll o en el resto de las páginas. Menú hamburguesa en móvil.
const NAV_LINKS = [
  { href: "/tienda", label: "Tienda" },
  { href: "/clases", label: "Clases" },
  { href: "/suscripcion", label: "Suscripción" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isLanding = pathname === "/";
  const solid = scrolled || !isLanding || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al cambiar de ruta.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background-color .35s ease, box-shadow .35s ease",
        backgroundColor: solid ? "rgba(237,230,233,0.92)" : "transparent",
        backdropFilter: solid ? "saturate(140%) blur(8px)" : "none",
        boxShadow: solid ? "0 6px 24px -16px rgba(26,26,26,.5)" : "none",
      }}
    >
      <nav
        className="kiori-container"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}
      >
        <Link href="/" aria-label="Inicio Kiori" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/landing/logo-teal.png" alt="Kiori" width={64} height={75} priority style={{ height: 46, width: "auto" }} />
        </Link>

        {/* Links de escritorio */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}

          <Link href="/tienda/carrito" className="nav-link" style={{ position: "relative" }} aria-label="Carrito">
            Carrito
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {!user ? (
            <>
              <Link href="/iniciar-sesion" className="nav-link">Iniciar sesión</Link>
              <Link href="/registrarse" className="btn-pill btn-nude" style={{ padding: ".6rem 1.4rem" }}>
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && <Link href="/admin" className="nav-link">Administrador</Link>}
              <Link href="/perfil" className="nav-link">Mi perfil</Link>
              <button onClick={logout} className="btn-pill btn-outline" style={{ padding: ".55rem 1.3rem" }}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="nav-burger"
          aria-label="Menú"
          onClick={() => setOpen((o) => !o)}
          style={{ display: "none", background: "none", border: "none", color: "var(--color-sage)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="nav-mobile" style={{ borderTop: "1px solid rgba(63,91,90,.15)" }}>
          <div className="kiori-container" style={{ display: "flex", flexDirection: "column", gap: ".25rem", padding: "1rem var(--gutter) 1.5rem" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link-mobile">{l.label}</Link>
            ))}
            <Link href="/tienda/carrito" className="nav-link-mobile">Carrito {count > 0 ? `(${count})` : ""}</Link>
            {!user ? (
              <>
                <Link href="/iniciar-sesion" className="nav-link-mobile">Iniciar sesión</Link>
                <Link href="/registrarse" className="btn-pill btn-nude" style={{ marginTop: ".5rem" }}>Registrarse</Link>
              </>
            ) : (
              <>
                {user.role === "admin" && <Link href="/admin" className="nav-link-mobile">Administrador</Link>}
                <Link href="/perfil" className="nav-link-mobile">Mi perfil</Link>
                <button onClick={logout} className="btn-pill btn-outline" style={{ marginTop: ".5rem" }}>Cerrar sesión</button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-family: var(--font-display);
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-sage);
          transition: opacity 0.2s ease;
        }
        .nav-link:hover { opacity: 0.6; }
        .nav-link-mobile {
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-sage);
          padding: 0.65rem 0;
          font-size: 0.95rem;
        }
        .cart-badge {
          position: absolute;
          top: -10px;
          right: -14px;
          background: var(--color-nude-deep);
          color: #fff;
          font-size: 0.62rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        .nav-mobile { background-color: rgba(237, 230, 233, 0.98); }
        @media (max-width: 880px) {
          :global(.nav-desktop) { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
