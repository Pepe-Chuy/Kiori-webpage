"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { MOCK_CLASSES } from "@/lib/mock/classes";
import PageBanner from "@/components/ui/PageBanner";
import type { OnlineClass } from "@/lib/types";

function embedUrl(c: import("@/lib/types").OnlineClass): string {
  const id = c.youtubeVideoId;
  switch (c.videoProvider) {
    case "vimeo":
      return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
    case "bunny":
      // id format: "libraryId/videoId"
      return `https://iframe.mediadelivery.net/embed/${id}?autoplay=true&preload=true`;
    case "mux":
      return `https://stream.mux.com/${id}.m3u8`;
    default: // youtube
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
}

function thumbnailUrl(c: import("@/lib/types").OnlineClass): string {
  const id = c.youtubeVideoId;
  switch (c.videoProvider) {
    case "vimeo":
      return `https://vumbnail.com/${id}.jpg`;
    case "bunny":
      return `https://vz-cdn.b-cdn.net/${id.split("/")[1]}/thumbnail.jpg`;
    default:
      return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }
}

// /clases — Sólo para suscriptoras activas.
export default function ClasesPage() {
  const { user, ready } = useAuth();
  const [playing, setPlaying] = useState<OnlineClass | null>(null);
  const [classes, setClasses] = useState<OnlineClass[]>([]);

  useEffect(() => {
    if (user?.subscriptionStatus !== "active") return;
    const supabase = createClient();
    supabase
      .from("classes")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setClasses(MOCK_CLASSES);
          return;
        }
        setClasses(data.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description ?? "",
          youtubeVideoId: c.youtube_video_id,
          type: c.type,
          instructor: c.instructor ?? "",
          durationMinutes: c.duration_minutes ?? 0,
          category: c.category ?? "",
          isPublished: c.is_published,
        })));
      });
  }, [user?.subscriptionStatus]);

  if (!ready) return <div className="page" />;

  const isSubscriber = user?.subscriptionStatus === "active";

  // Sin suscripción activa: se invita a suscribirse (no se muestran las clases).
  if (!isSubscriber) {
    return (
      <div className="page">
        <PageBanner title="Clases" accent="en línea" />
        <div className="kiori-container section-pad" style={{ textAlign: "center" }}>
          <div className="card" style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem" }}>
            <h2 style={{ color: "var(--color-sage)", marginBottom: "1rem" }}>Contenido exclusivo para suscriptoras</h2>
            <p className="muted" style={{ lineHeight: 1.7, marginBottom: "1.8rem" }}>
              Las clases de yoga, barre y meditación están disponibles únicamente con una
              suscripción activa. Únete para acceder a clases en vivo y grabadas.
            </p>
            <Link href="/suscripcion" className="btn-pill btn-nude">Ver planes de suscripción</Link>
          </div>
        </div>
      </div>
    );
  }

  const published = classes;

  return (
    <div className="page">
      <PageBanner title="Clases" accent="en línea">
        Conecta cuerpo, mente y movimiento. Clases en vivo y grabadas para tu práctica diaria.
      </PageBanner>

      <div className="kiori-container section-pad">
        <div className="clases-grid">
          {published.map((c) => (
            <article key={c.id} className="card clase">
              <button className="clase-thumb" onClick={() => setPlaying(c)} aria-label={`Reproducir ${c.title}`}>
                <img src={thumbnailUrl(c)} alt={c.title} />
                <span className="play">▶</span>
                {c.type === "en-vivo" && <span className="live">EN VIVO</span>}
              </button>
              <div style={{ padding: "1.1rem 1.2rem 1.4rem" }}>
                <span className="prod-cat" style={{ textTransform: "uppercase", letterSpacing: ".12em", fontSize: ".68rem", color: "var(--color-nude)" }}>
                  {c.category} · {c.durationMinutes} min
                </span>
                <h3 style={{ color: "var(--color-sage)", margin: ".3rem 0 .5rem" }}>{c.title}</h3>
                <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6 }}>{c.description}</p>
                <p className="muted" style={{ fontSize: ".8rem", marginTop: ".6rem" }}>con {c.instructor}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {playing && (
        <div className="modal-backdrop" onClick={() => setPlaying(null)}>
          <div className="player" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPlaying(null)} aria-label="Cerrar">×</button>
            <div className="player-frame">
              <iframe
                src={embedUrl(playing)}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 style={{ color: "var(--color-sage)", marginTop: "1rem" }}>{playing.title}</h3>
          </div>
        </div>
      )}

      <style jsx>{`
        .clases-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .clase-thumb { position: relative; border: none; padding: 0; background: none; cursor: pointer; display: block; width: 100%; aspect-ratio: 16/9; overflow: hidden; }
        .clase-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .play {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 2.2rem; background: rgba(63,91,90,.25); transition: background .2s ease;
        }
        .clase-thumb:hover .play { background: rgba(63,91,90,.45); }
        .live {
          position: absolute; top: .7rem; left: .7rem; background: var(--color-nude-deep); color: #fff;
          font-size: .65rem; letter-spacing: .1em; padding: .25rem .6rem; border-radius: 999px; font-weight: 700;
        }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(26,26,26,.7); display: flex; align-items: center; justify-content: center; padding: 1.5rem; z-index: 200; }
        .player { width: 100%; max-width: 880px; position: relative; }
        .modal-close { position: absolute; top: -2.4rem; right: 0; background: none; border: none; font-size: 2rem; color: #fff; }
        .player-frame { position: relative; padding-top: 56.25%; border-radius: 16px; overflow: hidden; background: #000; }
        .player-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        /* Covers the YouTube info-card / copy-link overlay in the top-left corner */
        .yt-shield { position: absolute; top: 0; left: 0; width: 40%; height: 15%; z-index: 2; pointer-events: none; }
        .player h3 { color: var(--color-blush); }
      `}</style>
    </div>
  );
}
