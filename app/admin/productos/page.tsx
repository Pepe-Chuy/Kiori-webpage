"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_PRODUCTS } from "@/lib/mock/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

const EMPTY_FORM = { name: "", description: "", price: "", quantity: "", categories: "", imageUrl: "" };

export default function AdminProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Product | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) { setProducts(MOCK_PRODUCTS); return; }
    setProducts(data.map(row2product));
  }

  function row2product(p: any): Product {
    return {
      id: p.id, name: p.name, description: p.description ?? "",
      price: p.price, categories: p.categories ?? [],
      quantity: p.quantity, imageUrl: p.image_url ?? "", isActive: p.is_active,
    };
  }

  function openNew() { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), quantity: String(p.quantity), categories: p.categories.join(", "), imageUrl: p.imageUrl });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      name: form.name, description: form.description,
      price: parseFloat(form.price), quantity: parseInt(form.quantity),
      categories: form.categories.split(",").map((c) => c.trim()).filter(Boolean),
      image_url: form.imageUrl,
    };
    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert({ ...payload, is_active: true });
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function toggleActive(p: Product) {
    await supabase.from("products").update({ is_active: !p.isActive }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, isActive: !p.isActive } : x));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Productos</h1>
        <button className="btn-pill btn-nude" onClick={openNew}>+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "1.6rem", margin: "1.5rem 0" }}>
          <h2 className="admin-h2">{editing ? "Editar producto" : "Nuevo producto"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="field-group"><label>Nombre</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field-group"><label>Precio (MXN)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div className="field-group"><label>Stock</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
            <div className="field-group">
              <label>Categorías</label>
              <input placeholder={PRODUCT_CATEGORIES.join(", ")} value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} />
            </div>
            <div className="field-group" style={{ gridColumn: "1 / -1" }}><label>URL de imagen</label><input placeholder="https://… o /landing/products-flatlay.jpg" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
          </div>
          <div className="field-group" style={{ marginTop: "1rem" }}><label>Descripción</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: ".8rem", marginTop: "1rem" }}>
            <button className="btn-pill btn-sage" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
            <button className="btn-pill btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
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
                <button className="adm-btn" onClick={() => openEdit(p)}>Editar</button>
                <button className="adm-btn" onClick={() => toggleActive(p)}>{p.isActive ? "Ocultar" : "Activar"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
