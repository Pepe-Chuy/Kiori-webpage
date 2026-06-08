"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_BENEFITS } from "@/lib/constants";
import PageBanner from "@/components/ui/PageBanner";

// /suscripcion — Página pública de planes y beneficios (kiori_spec.md §8).
export default function SuscripcionPage() {
  const { user, activateSubscription } = useAuth();

  function handleChoose(tier: "mensual" | "trimestral" | "anual") {
    // Si no hay sesión, se envía a registro; con sesión se "activa" (demo Stripe).
    if (!user) {
      window.location.href = "/registrarse?redirect=/suscripcion";
      return;
    }
    activateSubscription(tier);
    window.location.href = "/perfil";
  }

  return (
    <div className="page">
      <PageBanner title="Suscripción" accent="Kiori">
        Una caja mensual personalizada, acceso a clases en línea y beneficios exclusivos.
        Tú eliges con qué frecuencia se realiza el cobro.
      </PageBanner>

      {/* Beneficios */}
      <section className="kiori-container section-pad">
        <h2 style={{ color: "var(--color-sage)", textAlign: "center", marginBottom: "2rem", fontSize: "1.6rem" }}>
          Todo lo que incluye tu membresía
        </h2>
        <div className="benefits">
          {SUBSCRIPTION_BENEFITS.map((b, i) => (
            <div key={i} className="card benefit">
              <span className="benefit-num">0{i + 1}</span>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section className="kiori-container section-pad" style={{ paddingTop: 0 }}>
        <h2 style={{ color: "var(--color-sage)", textAlign: "center", marginBottom: "2.5rem", fontSize: "1.6rem" }}>
          Elige tu plan
        </h2>
        <div className="plans">
          {SUBSCRIPTION_PLANS.map((p) => (
            <div key={p.id} className={`card plan ${"highlighted" in p && p.highlighted ? "plan-hi" : ""}`}>
              {"highlighted" in p && p.highlighted && <span className="plan-tag">Más popular</span>}
              <h3 className="plan-name">{p.name}</h3>
              <p className="plan-billing">{p.billing}</p>
              <p className="plan-price">${p.price}<span> MXN</span></p>
              <p className="muted plan-note">{p.note}</p>
              <button className="btn-pill btn-nude" style={{ width: "100%" }} onClick={() => handleChoose(p.id as any)}>
                {user ? "Suscribirme" : "Crear cuenta y suscribirme"}
              </button>
            </div>
          ))}
        </div>
        <p className="muted" style={{ textAlign: "center", marginTop: "2rem", fontSize: ".85rem" }}>
          Los tres planes entregan <strong>una caja mensual</strong>; el plan sólo cambia la frecuencia del cobro.
          Puedes cancelar cuando quieras desde tu <Link href="/perfil" style={{ color: "var(--color-sage)" }}>perfil</Link>.
        </p>
      </section>

      <style jsx>{`
        .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.2rem; }
        .benefit { padding: 1.6rem; display: flex; gap: 1rem; align-items: flex-start; }
        .benefit-num { font-family: var(--font-display); font-weight: 700; color: var(--color-rose); font-size: 1.4rem; }
        .benefit p { color: var(--color-ink); line-height: 1.6; margin: 0; }
        .plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; max-width: 980px; margin: 0 auto; }
        .plan { padding: 2.2rem; text-align: center; position: relative; }
        .plan-hi { border: 2px solid var(--color-rose); transform: translateY(-6px); }
        .plan-tag {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--color-rose); color: var(--color-sage); border-radius: 999px;
          padding: .3rem 1rem; font-size: .72rem; font-family: var(--font-display); letter-spacing: .08em;
        }
        .plan-name { color: var(--color-sage); font-size: 1.4rem; }
        .plan-billing { color: var(--color-nude); font-size: .85rem; margin-bottom: 1.2rem; }
        .plan-price { font-size: 2.4rem; font-weight: 700; color: var(--color-ink); }
        .plan-price span { font-size: .9rem; font-weight: 400; color: var(--color-nude); }
        .plan-note { font-size: .85rem; margin: .8rem 0 1.6rem; min-height: 2.4rem; }
      `}</style>
    </div>
  );
}
