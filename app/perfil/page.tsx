"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import PageBanner from "@/components/ui/PageBanner";

// /perfil — Panel de la usuaria (kiori_spec.md §10). Requiere sesión.
const SECTIONS = [
  { id: "datos", label: "Mis datos" },
  { id: "preferencias", label: "Preferencias" },
  { id: "puntos", label: "Puntos Kiori" },
  { id: "suscripcion", label: "Mi suscripción" },
  { id: "pedidos", label: "Historial de pedidos" },
  { id: "paquetes", label: "Mis paquetes" },
  { id: "referido", label: "Código de referido" },
];

export default function PerfilPage() {
  const { user, ready, logout, cancelSubscription } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState("datos");
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Protección de ruta: sin sesión se va al login.
  useEffect(() => {
    if (ready && !user) router.replace("/iniciar-sesion?redirect=/perfil");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="page" />;

  return (
    <div className="page">
      <PageBanner title="Hola," accent={user.name}>
        Gestiona tus datos, tu suscripción, tus pedidos y tus Puntos Kiori.
      </PageBanner>

      <div className="kiori-container section-pad profile-layout">
        <aside className="profile-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} className={`pnav ${active === s.id ? "active" : ""}`} onClick={() => setActive(s.id)}>
              {s.label}
            </button>
          ))}
          {user.role === "admin" && <Link href="/admin" className="pnav">Panel admin →</Link>}
          <button className="pnav logout" onClick={logout}>Cerrar sesión</button>
        </aside>

        <section className="profile-content card">
          {active === "datos" && (
            <Block title="Mis datos">
              <div className="grid2">
                <Field label="Nombre" value={user.name} />
                <Field label="Correo" value={user.email} />
                <Field label="Ubicación" value="Ciudad de México" />
                <Field label="Edad" value="—" />
              </div>
              <button className="btn-pill btn-outline" style={{ marginTop: "1.2rem" }}>Editar datos</button>
            </Block>
          )}

          {active === "preferencias" && (
            <Block title="Mi formulario de preferencias">
              <p className="muted" style={{ lineHeight: 1.7 }}>
                Aquí podrás ver y editar tus respuestas para que tu caja mensual se ajuste a ti.
                El cuestionario de preferencias se definirá con la marca.
              </p>
              <button className="btn-pill btn-nude" style={{ marginTop: "1.2rem" }}>Llenar formulario</button>
            </Block>
          )}

          {active === "puntos" && (
            <Block title="Mis Puntos Kiori">
              <p className="puntos-balance">{user.puntosKiori} <span>pts</span></p>
              <p className="muted">Equivalen a ${user.puntosKiori} MXN de descuento en tu próxima compra.</p>
              <ul className="movs">
                <li><span>Bienvenida</span><strong>+150</strong></li>
                <li><span>Compra #1024</span><strong>−50</strong></li>
              </ul>
            </Block>
          )}

          {active === "suscripcion" && (
            <Block title="Mi suscripción">
              {user.subscriptionStatus === "active" ? (
                <>
                  <p>Plan: <strong style={{ textTransform: "capitalize" }}>{user.subscriptionTier}</strong></p>
                  <p className="muted">Estado: activa · Próximo cobro: 1 de cada mes</p>
                  {!confirmCancel ? (
                    <button className="btn-pill btn-outline" style={{ marginTop: "1.2rem" }} onClick={() => setConfirmCancel(true)}>
                      Cancelar suscripción
                    </button>
                  ) : (
                    <div className="notice" style={{ marginTop: "1.2rem" }}>
                      <p style={{ marginTop: 0 }}>¿Seguro que deseas cancelar? Seguirás teniendo acceso hasta el fin del periodo pagado.</p>
                      <div style={{ display: "flex", gap: ".6rem" }}>
                        <button className="btn-pill btn-sage" onClick={() => { cancelSubscription(); setConfirmCancel(false); }}>Sí, cancelar</button>
                        <button className="btn-pill btn-outline" onClick={() => setConfirmCancel(false)}>No</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="muted" style={{ lineHeight: 1.7 }}>
                    {user.subscriptionStatus === "canceled"
                      ? "Tu suscripción está cancelada. Mantienes acceso hasta el fin del periodo pagado."
                      : "Aún no tienes una suscripción activa."}
                  </p>
                  <Link href="/suscripcion" className="btn-pill btn-nude" style={{ marginTop: "1.2rem" }}>Ver planes</Link>
                </>
              )}
            </Block>
          )}

          {active === "pedidos" && (
            <Block title="Historial de pedidos">
              <table className="table">
                <thead><tr><th>Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th><th></th></tr></thead>
                <tbody>
                  <tr><td>#1024</td><td>12 may 2026</td><td>$648</td><td><span className="badge">Entregado</span></td><td><button className="link">Solicitar devolución</button></td></tr>
                  <tr><td>#1031</td><td>24 may 2026</td><td>$299</td><td><span className="badge alt">Enviado</span></td><td>—</td></tr>
                </tbody>
              </table>
            </Block>
          )}

          {active === "paquetes" && (
            <Block title="Mis paquetes mensuales">
              <p className="muted">Historial de cajas mensuales enviadas según tu suscripción.</p>
              <ul className="movs">
                <li><span>Caja de mayo 2026</span><strong>Entregada</strong></li>
                <li><span>Caja de abril 2026</span><strong>Entregada</strong></li>
              </ul>
            </Block>
          )}

          {active === "referido" && (
            <Block title="Mi código de referido">
              <p className="muted" style={{ lineHeight: 1.7 }}>
                Comparte tu código. Cuando alguien se registra y hace su primera compra o se suscribe,
                recibes <strong>150 Puntos Kiori</strong> (máx. 2 al mes).
              </p>
              <div className="referral">
                <code>{user.referralCode}</code>
                <button className="btn-pill btn-nude" onClick={() => navigator.clipboard?.writeText(user.referralCode)}>Copiar</button>
              </div>
            </Block>
          )}
        </section>
      </div>

      <style jsx>{`
        .profile-layout { display: grid; grid-template-columns: 230px 1fr; gap: 2rem; align-items: start; }
        .profile-nav { display: flex; flex-direction: column; gap: .35rem; }
        .pnav {
          text-align: left; background: none; border: none; padding: .7rem 1rem; border-radius: 10px;
          color: var(--color-sage); font-family: var(--font-display); font-size: .92rem; transition: background .2s ease;
        }
        .pnav:hover { background: rgba(63,91,90,.08); }
        .pnav.active { background: var(--color-sage); color: var(--color-white); }
        .pnav.logout { color: var(--color-nude); margin-top: 1rem; }
        .profile-content { padding: 2rem; min-height: 320px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .puntos-balance { font-size: 3rem; font-weight: 700; color: var(--color-rose); }
        .puntos-balance span { font-size: 1rem; color: var(--color-nude); }
        .movs { list-style: none; padding: 0; margin: 1.2rem 0 0; }
        .movs li { display: flex; justify-content: space-between; padding: .7rem 0; border-bottom: 1px solid rgba(63,91,90,.12); color: var(--color-ink); }
        .table { width: 100%; border-collapse: collapse; }
        .table th { text-align: left; font-size: .72rem; text-transform: uppercase; letter-spacing: .1em; color: var(--color-nude); padding: .6rem .5rem; }
        .table td { padding: .8rem .5rem; border-top: 1px solid rgba(63,91,90,.12); color: var(--color-ink); font-size: .92rem; }
        .badge { background: var(--color-sage); color: #fff; border-radius: 999px; padding: .2rem .7rem; font-size: .72rem; }
        .badge.alt { background: var(--color-nude-deep); }
        .link { background: none; border: none; color: var(--color-sage); text-decoration: underline; font-size: .85rem; cursor: pointer; }
        .referral { display: flex; gap: 1rem; align-items: center; margin-top: 1.2rem; flex-wrap: wrap; }
        .referral code { background: var(--color-blush); border: 1.5px dashed var(--color-rose); padding: .8rem 1.4rem; border-radius: 12px; font-size: 1.2rem; letter-spacing: .1em; color: var(--color-sage); }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; }
          .profile-nav { flex-direction: row; flex-wrap: wrap; }
          .grid2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ color: "var(--color-sage)", marginBottom: "1.4rem", fontSize: "1.4rem" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="field-group" style={{ marginBottom: 0 }}>
      <label>{label}</label>
      <input defaultValue={value} readOnly />
    </div>
  );
}
