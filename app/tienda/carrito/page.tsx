"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { FLAT_SHIPPING_FEE } from "@/lib/constants";
import PageBanner from "@/components/ui/PageBanner";

// /tienda/carrito — Carrito + checkout.
// Los invitados pueden ver y editar el carrito (persiste en localStorage),
// pero para FINALIZAR la compra se requiere cuenta (cambio solicitado).
export default function CarritoPage() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();

  const isSubscriber = user?.subscriptionStatus === "active";
  const [delivery, setDelivery] = useState<"ahora" | "con-paquete">("ahora");
  const [usePuntos, setUsePuntos] = useState(0);
  const [done, setDone] = useState(false);

  // Envío gratis sólo para suscriptoras que envían con su paquete mensual (§7).
  const freeShipping = isSubscriber && delivery === "con-paquete";
  const deliveryFee = items.length === 0 || freeShipping ? 0 : FLAT_SHIPPING_FEE;
  const maxPuntos = Math.min(user?.puntosKiori ?? 0, subtotal);
  const puntosApplied = Math.min(usePuntos, maxPuntos);
  const total = Math.max(0, subtotal + deliveryFee - puntosApplied);

  function handleCheckout() {
    // Gate de cuenta: el botón sólo procede con sesión.
    if (!user) return;
    setDone(true);
    clear();
  }

  if (done) {
    return (
      <div className="page">
        <PageBanner title="¡Gracias por tu" accent="compra!" />
        <div className="kiori-container section-pad" style={{ textAlign: "center" }}>
          <p className="muted" style={{ maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Tu pedido fue registrado. Recibirás un correo con el resumen y el número de
            rastreo cuando esté disponible.
          </p>
          <Link href="/tienda" className="btn-pill btn-nude">Seguir explorando</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageBanner title="Tu" accent="carrito">
        Revisa tus productos. Tu carrito se guarda aunque no hayas iniciado sesión.
      </PageBanner>

      <div className="kiori-container section-pad">
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>Tu carrito está vacío.</p>
            <Link href="/tienda" className="btn-pill btn-nude">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Lista de productos */}
            <div className="cart-items">
              {items.map((i) => (
                <div key={i.productId} className="card cart-row">
                  <img src={i.imageUrl} alt={i.name} className="cart-thumb" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "var(--color-sage)", fontSize: "1.05rem" }}>{i.name}</h3>
                    <p className="muted" style={{ fontSize: ".9rem" }}>${i.price} MXN</p>
                  </div>
                  <div className="qty">
                    <button onClick={() => setQuantity(i.productId, i.quantity - 1)} aria-label="Menos">−</button>
                    <span>{i.quantity}</span>
                    <button onClick={() => setQuantity(i.productId, i.quantity + 1)} aria-label="Más">+</button>
                  </div>
                  <strong style={{ minWidth: 90, textAlign: "right" }}>${i.price * i.quantity}</strong>
                  <button className="cart-remove" onClick={() => removeItem(i.productId)} aria-label="Eliminar">×</button>
                </div>
              ))}
            </div>

            {/* Resumen + checkout */}
            <aside className="cart-summary card">
              <h3 style={{ color: "var(--color-sage)", marginBottom: "1.2rem" }}>Resumen</h3>

              {/* Opciones de envío para suscriptoras */}
              {isSubscriber && (
                <div style={{ marginBottom: "1.2rem" }}>
                  <label className="opt">
                    <input type="radio" name="delivery" checked={delivery === "ahora"} onChange={() => setDelivery("ahora")} />
                    Enviar ahora (con costo)
                  </label>
                  <label className="opt">
                    <input type="radio" name="delivery" checked={delivery === "con-paquete"} onChange={() => setDelivery("con-paquete")} />
                    Enviar con mi paquete mensual (gratis)
                  </label>
                </div>
              )}

              {/* Puntos Kiori (sólo con sesión) */}
              {user && maxPuntos > 0 && (
                <div className="field-group">
                  <label>Usar Puntos Kiori (máx. {maxPuntos})</label>
                  <input
                    type="number"
                    min={0}
                    max={maxPuntos}
                    value={usePuntos}
                    onChange={(e) => setUsePuntos(Number(e.target.value))}
                  />
                </div>
              )}

              <dl className="totals">
                <div><dt>Subtotal</dt><dd>${subtotal}</dd></div>
                <div><dt>Envío</dt><dd>{deliveryFee === 0 ? "Gratis" : `$${deliveryFee}`}</dd></div>
                {puntosApplied > 0 && <div><dt>Puntos Kiori</dt><dd>−${puntosApplied}</dd></div>}
                <div className="grand"><dt>Total</dt><dd>${total} MXN</dd></div>
              </dl>

              {/* GATE DE CUENTA */}
              {user ? (
                <button className="btn-pill btn-sage" style={{ width: "100%" }} onClick={handleCheckout}>
                  Pagar con Stripe
                </button>
              ) : (
                <div>
                  <div className="notice" style={{ marginBottom: "1rem" }}>
                    Para <strong>finalizar tu compra</strong> necesitas una cuenta. No te preocupes:
                    tu carrito se conserva.
                  </div>
                  <Link
                    href="/registrarse?redirect=/tienda/carrito"
                    className="btn-pill btn-nude"
                    style={{ width: "100%", marginBottom: ".6rem" }}
                  >
                    Crear cuenta
                  </Link>
                  <Link
                    href="/iniciar-sesion?redirect=/tienda/carrito"
                    className="btn-pill btn-outline"
                    style={{ width: "100%" }}
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
        .cart-items { display: flex; flex-direction: column; gap: 1rem; }
        .cart-row { display: flex; align-items: center; gap: 1rem; padding: .9rem 1.1rem; }
        .cart-thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 12px; }
        .qty { display: flex; align-items: center; gap: .6rem; }
        .qty button {
          width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--color-sage);
          background: none; color: var(--color-sage); font-size: 1.1rem; line-height: 1;
        }
        .cart-remove { background: none; border: none; font-size: 1.5rem; color: var(--color-nude); }
        .cart-summary { padding: 1.6rem; position: sticky; top: 96px; }
        .opt { display: flex; align-items: center; gap: .5rem; padding: .4rem 0; color: var(--color-sage); font-size: .92rem; }
        .totals { margin: 1.2rem 0 1.5rem; }
        .totals > div { display: flex; justify-content: space-between; padding: .35rem 0; color: var(--color-ink); }
        .totals dt, .totals dd { margin: 0; }
        .totals .grand { border-top: 1px solid rgba(63,91,90,.25); margin-top: .5rem; padding-top: .8rem; font-weight: 700; font-size: 1.1rem; color: var(--color-sage); }
        @media (max-width: 820px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
      `}</style>
    </div>
  );
}
