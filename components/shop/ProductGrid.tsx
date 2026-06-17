"use client";

import { useState, useEffect } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/context/CartContext";
import type { Product } from "@/lib/types";

// Catálogo de la tienda: cuadrícula + filtros por categoría + modal de detalle.
// El carrito funciona SIN sesión (los invitados pueden agregar productos).
export default function ProductGrid() {
  const { addItem } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filter, setFilter]           = useState<string>("Todas");
  const [selected, setSelected]       = useState<Product | null>(null);
  const [added, setAdded]             = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setAllProducts(MOCK_PRODUCTS.filter((p) => p.isActive));
          return;
        }
        setAllProducts(data.map((p) => ({
          id: p.id, name: p.name, description: p.description ?? "",
          price: p.price, categories: p.categories ?? [],
          quantity: p.quantity,
          imageUrl: p.image_url ?? "/landing/products-flatlay.jpg",
          isActive: p.is_active,
        })));
      });
  }, []);

  const products = filter === "Todas"
    ? allProducts
    : allProducts.filter((p) => p.categories.includes(filter as any));

  function handleAdd(p: Product) {
    addItem(p, 1);
    setAdded(p.id);
    setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1400);
  }

  return (
    <div className="kiori-container section-pad">
      {/* Filtros */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "2rem" }}>
        {["Todas", ...PRODUCT_CATEGORIES].map((c) => (
          <button key={c} className={`chip ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Cuadrícula */}
      <div className="prod-grid">
        {products.map((p) => (
          <article key={p.id} className="card prod-card">
            <button className="prod-imgbtn" onClick={() => setSelected(p)} aria-label={`Ver ${p.name}`}>
              <img src={p.imageUrl} alt={p.name} />
            </button>
            <div className="prod-body">
              <span className="prod-cat">{p.categories[0]}</span>
              <h3 className="prod-name">{p.name}</h3>
              <div className="prod-foot">
                <span className="prod-price">${p.price} MXN</span>
                <button className="btn-pill btn-nude prod-add" onClick={() => handleAdd(p)}>
                  {added === p.id ? "¡Agregado!" : "Agregar"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de detalle */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button>
            <div className="modal-grid">
              <img className="modal-img" src={selected.imageUrl} alt={selected.name} />
              <div className="modal-info">
                <span className="prod-cat">{selected.categories.join(" · ")}</span>
                <h2 className="modal-title">{selected.name}</h2>
                <p className="muted" style={{ lineHeight: 1.7, margin: "1rem 0" }}>{selected.description}</p>
                <p className="modal-price">${selected.price} MXN</p>
                <p className="muted" style={{ fontSize: ".85rem" }}>
                  {selected.quantity > 0 ? `${selected.quantity} disponibles` : "Agotado"}
                </p>
                <button
                  className="btn-pill btn-nude"
                  style={{ marginTop: "1.5rem" }}
                  onClick={() => { handleAdd(selected); setSelected(null); }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: clamp(1rem, 2vw, 1.6rem);
        }
        .prod-card { display: flex; flex-direction: column; transition: transform .25s ease; }
        .prod-card:hover { transform: translateY(-4px); }
        .prod-imgbtn { border: none; padding: 0; background: none; cursor: pointer; display: block; }
        .prod-imgbtn img { width: 100%; height: 220px; object-fit: cover; }
        .prod-body { padding: 1rem 1.1rem 1.2rem; display: flex; flex-direction: column; gap: .4rem; flex: 1; }
        .prod-cat { font-size: .68rem; text-transform: uppercase; letter-spacing: .14em; color: var(--color-nude); }
        .prod-name { font-size: 1.05rem; color: var(--color-sage); }
        .prod-foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: .8rem; gap: .5rem; }
        .prod-price { font-weight: 700; color: var(--color-ink); }
        .prod-add { padding: .55rem 1.1rem; font-size: .68rem; }

        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(26,26,26,.55);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem; z-index: 200;
        }
        .modal { max-width: 800px; width: 100%; position: relative; }
        .modal-close {
          position: absolute; top: .6rem; right: .9rem; background: none; border: none;
          font-size: 2rem; line-height: 1; color: var(--color-sage); z-index: 2;
        }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .modal-img { width: 100%; height: 100%; min-height: 340px; object-fit: cover; }
        .modal-info { padding: 2.2rem; }
        .modal-title { font-size: 1.8rem; color: var(--color-sage); margin-top: .3rem; }
        .modal-price { font-size: 1.4rem; font-weight: 700; color: var(--color-ink); }
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr; }
          .modal-img { min-height: 220px; max-height: 240px; }
        }
      `}</style>
    </div>
  );
}
