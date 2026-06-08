"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Footer global (kiori_spec.md §14).
export default function Footer() {
  const pathname = usePathname();
  // El landing trae su propia sección de cierre (registro); evitamos doble footer pesado allí,
  // pero mantenemos un pie legal mínimo en todas las páginas.
  const minimal = pathname === "/";

  if (minimal) {
    return (
      <footer style={{ background: "var(--color-sage)", color: "var(--color-blush)", padding: "1.5rem 0" }}>
        <div className="kiori-container" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center", fontSize: ".8rem" }}>
          <span>© {new Date().getFullYear()} Kiori — Energía que inspira</span>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <Link href="/suscripcion">Suscripción</Link>
            <Link href="/tienda">Tienda</Link>
            <Link href="/clases">Clases</Link>
            <span style={{ opacity: 0.7 }}>Aviso de privacidad</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: "var(--color-sage)", color: "var(--color-blush)", paddingTop: "3.5rem" }}>
      <div className="kiori-container" style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", paddingBottom: "2.5rem" }}>
        <div>
          {/* Logo en blanco sobre el verde salvia */}
          <img src="/landing/logo-white.png" alt="Kiori" style={{ height: 54, width: "auto", marginBottom: ".75rem" }} />
          <p style={{ fontSize: ".85rem", opacity: 0.85, maxWidth: 220 }}>
            Bienestar, energía y rituales conscientes en un solo sitio.
          </p>
        </div>
        <FooterCol title="Explora" links={[["Tienda", "/tienda"], ["Clases", "/clases"], ["Suscripción", "/suscripcion"], ["Mi perfil", "/perfil"]]} />
        <FooterCol title="Cuenta" links={[["Iniciar sesión", "/iniciar-sesion"], ["Registrarse", "/registrarse"], ["Mi carrito", "/tienda/carrito"]]} />
        <div>
          <h4 style={{ fontSize: ".8rem", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "1rem" }}>Contacto</h4>
          <p style={{ fontSize: ".85rem", opacity: 0.85, lineHeight: 1.9 }}>
            hola@kiori.mx<br />
            Ciudad de México<br />
            <span style={{ opacity: 0.7 }}>Instagram · TikTok · Pinterest</span>
          </p>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(237,230,233,.2)" }}>
        <div className="kiori-container" style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "space-between", padding: "1.25rem var(--gutter)", fontSize: ".78rem", opacity: 0.85 }}>
          <span>© {new Date().getFullYear()} Kiori. Todos los derechos reservados.</span>
          <span>Aviso de privacidad · Términos y condiciones</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 style={{ fontSize: ".8rem", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "1rem" }}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: ".55rem" }}>
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} style={{ fontSize: ".85rem", opacity: 0.88 }}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
