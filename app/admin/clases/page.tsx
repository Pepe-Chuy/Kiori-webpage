"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_CLASSES } from "@/lib/mock/classes";
import type { OnlineClass } from "@/lib/types";

const EMPTY_FORM = { title: "", playbackId: "", instructor: "Kiori Studio", category: "", type: "grabada", durationMinutes: 45, description: "" };

export default function AdminClases() {
  const [classes, setClasses]   = useState<OnlineClass[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<OnlineClass | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("classes").select("*").order("created_at", { ascending: false });
    if (!data || data.length === 0) { setClasses(MOCK_CLASSES); return; }
    setClasses(data.map(row2class));
  }

  function row2class(c: any): OnlineClass {
    return {
      id: c.id, title: c.title, description: c.description ?? "",
      youtubeVideoId: c.youtube_video_id, videoProvider: "mux", type: c.type,
      instructor: c.instructor ?? "", durationMinutes: c.duration_minutes ?? 0,
      category: c.category ?? "", isPublished: c.is_published,
    };
  }

  function openNew() { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }
  function openEdit(c: OnlineClass) {
    setEditing(c);
    setForm({ title: c.title, playbackId: c.youtubeVideoId, instructor: c.instructor, category: c.category, type: c.type, durationMinutes: c.durationMinutes, description: c.description });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: form.title, youtube_video_id: form.playbackId, video_provider: "mux",
      instructor: form.instructor, category: form.category, type: form.type,
      duration_minutes: Number(form.durationMinutes), description: form.description,
    };
    if (editing) {
      await supabase.from("classes").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("classes").insert({ ...payload, is_published: false });
    }
    setSaving(false);
    setShowForm(false);
    load();
  }

  async function togglePublish(c: OnlineClass) {
    await supabase.from("classes").update({ is_published: !c.isPublished }).eq("id", c.id);
    setClasses((prev) => prev.map((x) => x.id === c.id ? { ...x, isPublished: !c.isPublished } : x));
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar esta clase?")) return;
    await supabase.from("classes").delete().eq("id", id);
    setClasses((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Clases</h1>
        <button className="btn-pill btn-nude" onClick={openNew}>+ Nueva clase</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "1.6rem", margin: "1.5rem 0" }}>
          <h2 className="admin-h2">{editing ? "Editar clase" : "Nueva clase"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="field-group"><label>Título</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="field-group">
              <label>Mux Playback ID</label>
              <input
                placeholder="DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"
                value={form.playbackId}
                onChange={(e) => setForm({ ...form, playbackId: e.target.value })}
              />
            </div>
            <div className="field-group"><label>Instructor</label><input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} /></div>
            <div className="field-group"><label>Categoría</label><input placeholder="yoga / barre / pilates" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="field-group"><label>Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="grabada">grabada</option>
                <option value="en-vivo">en-vivo</option>
              </select>
            </div>
            <div className="field-group"><label>Duración (min)</label><input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></div>
          </div>
          <div className="field-group" style={{ marginTop: "1rem" }}><label>Descripción</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: ".8rem", marginTop: "1rem" }}>
            <button className="btn-pill btn-sage" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
            <button className="btn-pill btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <table className="adm-table" style={{ marginTop: "1.5rem" }}>
        <thead><tr><th>Título</th><th>Tipo</th><th>Categoría</th><th>Mux Playback ID</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td><span className={`adm-badge ${c.type === "en-vivo" ? "nude" : ""}`}>{c.type}</span></td>
              <td>{c.category}</td>
              <td><code style={{ fontSize: ".75rem" }}>{c.youtubeVideoId}</code></td>
              <td><span className={`adm-badge ${c.isPublished ? "green" : ""}`}>{c.isPublished ? "Publicada" : "Oculta"}</span></td>
              <td>
                <button className="adm-btn" onClick={() => openEdit(c)}>Editar</button>
                <button className="adm-btn" onClick={() => togglePublish(c)}>{c.isPublished ? "Ocultar" : "Publicar"}</button>
                <button className="adm-btn" onClick={() => del(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
