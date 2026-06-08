"use client";

import { useState } from "react";
import { MOCK_CLASSES } from "@/lib/mock/classes";

// /admin/clases — Gestión de clases (kiori_spec.md §12).
export default function AdminClases() {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [showForm, setShowForm] = useState(false);

  function togglePublish(id: string) {
    setClasses((c) => c.map((x) => (x.id === id ? { ...x, isPublished: !x.isPublished } : x)));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Clases</h1>
        <button className="btn-pill btn-nude" onClick={() => setShowForm((s) => !s)}>+ Nueva clase</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "1.6rem", margin: "1.5rem 0" }}>
          <h2 className="admin-h2">Publicar clase</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="field-group"><label>Título</label><input /></div>
            <div className="field-group"><label>YouTube Video ID</label><input placeholder="dQw4w9WgXcQ" /></div>
            <div className="field-group"><label>Instructor</label><input /></div>
            <div className="field-group"><label>Categoría</label><input placeholder="yoga / barre / meditación" /></div>
            <div className="field-group"><label>Tipo</label><select><option>grabada</option><option>en-vivo</option></select></div>
            <div className="field-group"><label>Duración (min)</label><input type="number" /></div>
          </div>
          <button className="btn-pill btn-sage">Guardar clase</button>
        </div>
      )}

      <table className="adm-table" style={{ marginTop: "1.5rem" }}>
        <thead><tr><th>Título</th><th>Tipo</th><th>Instructor</th><th>Video ID</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td><span className={`adm-badge ${c.type === "en-vivo" ? "nude" : ""}`}>{c.type}</span></td>
              <td>{c.instructor}</td>
              <td><code>{c.youtubeVideoId}</code></td>
              <td><span className={`adm-badge ${c.isPublished ? "green" : ""}`}>{c.isPublished ? "Publicada" : "Oculta"}</span></td>
              <td>
                <button className="adm-btn" onClick={() => togglePublish(c.id)}>{c.isPublished ? "Ocultar" : "Publicar"}</button>
                <button className="adm-btn">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
