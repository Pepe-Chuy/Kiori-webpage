"use client";

import { useState } from "react";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

// /admin/productos — Gestión de productos (kiori_spec.md §12).
export default function AdminProductos() {
  const [products, setProducts] = useState(MOCK_PRODUCTS.slice(0, 12));
  const [showForm, setShowForm] = useState(false);

  function toggleActive(id: string) {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x)));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Productos</h1>
        <button className="btn-pill btn-nude" onClick={() => setShowForm((s) => !s)}>+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "1.6rem", margin: "1.5rem 0" }}>
          <h2 className="admin-h2">Crear producto</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="field-group"><label>Nombre</label><input /></div>
            <div className="field-group"><label>Precio (MXN)</label><input type="number" /></div>
            <div className="field-group"><label>Stock</label><input type="number" /></div>
            <div className="field-group"><label>Categorías</label><input placeholder="Meditación, Cuarzos…" /></div>
          </div>
          <div className="field-group"><label>Imagen (Cloudinary)</label><input type="file" /></div>
          <button className="btn-pill btn-sage">Guardar producto</button>
        </div>
      )}

      <table className="adm-table" style={{ marginTop: "1.5rem" }}>
        <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Visible</th><th>Acciones</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.categories[0]}</td>
              <td>${p.price}</td>
              <td>{p.quantity}</td>
              <td><span className={`adm-badge ${p.isActive ? "green" : ""}`}>{p.isActive ? "Activo" : "Oculto"}</span></td>
              <td>
                <button className="adm-btn">Editar</button>
                <button className="adm-btn" onClick={() => toggleActive(p.id)}>{p.isActive ? "Ocultar" : "Activar"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
