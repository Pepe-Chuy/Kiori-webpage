"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   LANDING DE KIORI — v2
   ------------------------------------------------------------
   CAMBIOS APLICADOS EN ESTA VERSIÓN:
   1. Video con espejo horizontal (scaleX -1) → la mujer queda a la derecha
   2. Logo de Kiori metido dentro del Hero (encima del eyebrow)
      → el navbar ya no debería mostrar el logo (ver nota al final)
   3. Eyebrow: Raleway, tamaño mayor, letter-spacing reducido
   4. Títulos hero: letter-spacing negativo → letras más compactas/rectangulares
   5. Botón CTA sacado de HeroContent y posicionado absolutamente
      al fondo del hero, centrado, color rose, texto negro Raleway thin
   6. Overlay del hero ligeramente más opaco para mejor legibilidad
   ============================================================ */

// ---- Textos del diseño (fuente de verdad: Landing.svg) ----
const TXT = {
  heroEyebrow: "MEDITACIÓN Y WELLNESS EN UN SOLO SITIO",
  heroTitle1: "ENERGÍA QUE",
  heroTitle2: "INSPIRA",
  heroCta: "ÚNETE A LA COMUNIDAD KIORI",
  s2Title1: "KIORI es un espacio de",
  s2Title2: "bienestar, energía y rituales conscientes.",
  s2Paragraph:
    "Creamos experiencias, herramientas y piezas con intención, desde meditaciones y talleres hasta joyería y cuarzos, para acompañarte en tu proceso de conexión y equilibrio personal.",
  s2Cta: "TU PLAN PERFECTO",
  serviciosTitle: "SERVICIOS",
  serviciosSubtitle: "OPCIONES CREADAS PARA ACOMPAÑARTE EN TU CAMINO DE BIENESTAR",
  catalogCta: "EXPLORA EL CATÁLOGO",
  catalogCols: [
    "Clases y productos pensados para elevar tu energía y tu rutina.",
    "Bienestar práctico que se adapta a tu día a día.",
    "Cada pieza está elegida para acompañarte en tu camino.",
  ],
  clasesTitle1: "Energía que inspira",
  clasesTitle2: "cada paso de tu rutina.",
  clasesSubtitle: "Clases diseñadas para conectar cuerpo, mente y movimiento.",
  signupTitle1: "BIENVENIDO A",
  signupTitle2: "LA COMUNIDAD KIORI",
};

const SERVICES = [
  { img: "/landing/card-clase.png", label: ["UNA NUEVA CLASE", "CADA MES"], href: "/clases", cls: "card-left" },
  { img: "/landing/card-beneficios.png", label: ["BENEFICIOS", "MENSUALES"], href: "/suscripcion", cls: "card-center" },
  { img: "/landing/card-productos.png", label: ["PRODUCTOS", "KIORI"], href: "/tienda", cls: "card-right" },
];

/* ----------------------------------------------------------------
   COMPONENTE: HeroContent
   CAMBIOS vs v1:
   - Se agregó el bloque .hero-brand (logo grande) arriba del eyebrow
   - Se ELIMINÓ el <Link> del botón CTA de aquí
     El botón ahora vive como hermano del kiori-container en el JSX
     del hero, posicionado absolutamente al fondo (hero-cta-bottom)
   ---------------------------------------------------------------- */
function HeroContent() {
  return (
    <div className="hero-text">

      {/*
        NUEVO: Logo de Kiori grande dentro del hero.
        Antes estaba solo en el navbar; ahora vive aquí.
        Asegúrate de que la ruta sea correcta para tu proyecto.
        Si tu logo stacked (icono + texto apilados) es un archivo
        distinto al horizontal, cámbia el src aquí.
      */}
      <div className="hero-brand">
        <img
          src="/landing/logo-teal.png"
          alt="Kiori"
          className="hero-brand-img"
        />
      </div>

      {/* Eyebrow: ahora Raleway, más grande, letter-spacing reducido */}
      <p className="hero-eyebrow">{TXT.heroEyebrow}</p>

      {/*
        Títulos: el letter-spacing negativo (-0.03em) comprime las letras
        horizontalmente, dando ese efecto "casi rectangular" del diseño target.
      */}
      <h1 className="hero-title">
        <span className="hero-line1">{TXT.heroTitle1}</span>
        <span className="italic-accent hero-line2">{TXT.heroTitle2}</span>
      </h1>

      {/* El botón CTA ya NO va aquí — ver .hero-cta-bottom más abajo */}
    </div>
  );
}

/* ----------------------------------------------------------------
   Los demás componentes de contenido no cambian
   ---------------------------------------------------------------- */

function Section2Content() {
  return (
    <div className="s2-grid">
      <div className="s2-text">
        <h2 className="s2-title">
          {TXT.s2Title1} <span className="italic-accent">{TXT.s2Title2}</span>
        </h2>
        <p className="s2-paragraph">{TXT.s2Paragraph}</p>
        <Link href="/suscripcion" className="btn-pill btn-rose">{TXT.s2Cta}</Link>
      </div>
      <div className="s2-images">
        <div className="s2-img s2-img-a"><img src="/landing/medit-studio.jpg" alt="Mujer meditando" /></div>
        <div className="s2-img s2-img-b"><img src="/landing/medit-2.jpg" alt="Práctica de bienestar" /></div>
      </div>
    </div>
  );
}

function MissionBox() {
  return (
    <div className="mission-box">
      <p className="mission-line">
        Nuestra <b>misión y visión</b> en KIORI es inspirar y acompañar a las personas a
      </p>
      <p className="mission-line">
        través de <b>experiencias, productos y herramientas</b> de energía consciente,
      </p>
      <p className="mission-line">
        creando una comunidad cercana que transforme el wellness en un estilo de
      </p>
      <p className="mission-line">
        vida <b>auténtico, inspirador</b> y en constante evolución.
      </p>
    </div>
  );
}

function ServiciosContent() {
  return (
    <div className="svc-wrap">
      <div className="svc-head">
        <h2 className="svc-title">{TXT.serviciosTitle}</h2>
        <p className="svc-subtitle">{TXT.serviciosSubtitle}</p>
      </div>
      <div className="svc-cards">
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href} className={`svc-card ${s.cls}`}>
            <div className="svc-photo">
              <img className="card-img" src={s.img} alt={s.label.join(" ")} />
            </div>
            <span className="svc-label">
              {s.label[0]}<br />{s.label[1]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // ---------- ESCRITORIO: secuencia pinned + scrub ----------
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=3800",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Estados iniciales (no cambian respecto a v1)
      gsap.set(".layer-hero", { opacity: 1 });
      gsap.set(".s2-scene", { opacity: 0 });
      gsap.set(".s2-text", { xPercent: -10, opacity: 0 });
      gsap.set(".s2-images", { xPercent: 14, opacity: 0 });
      gsap.set(".layer-picnic", { opacity: 0 });
      gsap.set(".mission-box", { yPercent: 55, opacity: 0 });
      gsap.set(".mission-line", { opacity: 0, y: 18 });
      gsap.set(".layer-s4", { opacity: 0 });
      gsap.set(".card-left", { xPercent: -65, opacity: 0 });
      gsap.set(".card-center", { yPercent: 65, opacity: 0 });
      gsap.set(".card-right", { xPercent: 65, opacity: 0 });
      gsap.set(".card-img", { opacity: 0 });

      // ---- Fase A: Hero → Sección 2 ----
      // El botón (.hero-cta-bottom) está dentro de .layer-hero,
      // así que cuando el layer hace fade out, el botón también desaparece.
      tl.to(".layer-hero", { opacity: 0, duration: 1 }, 0)
        .to(".hero-text", { yPercent: -28, duration: 1 }, 0)
        .to(".s2-scene", { opacity: 1, duration: 0.4 }, 0.25)
        .to(".s2-text", { xPercent: 0, opacity: 1, duration: 1 }, 0.3)
        .to(".s2-images", { xPercent: 0, opacity: 1, duration: 1 }, 0.3);

      // ---- Fase B: Sección 2 → Sección 3 (misión/visión) ----
      tl.to(".s2-scene", { opacity: 0, duration: 0.8 }, 1.3)
        .to(".layer-picnic", { opacity: 1, duration: 1 }, 1.3)
        .to(".mission-box", { yPercent: 0, opacity: 1, duration: 1 }, 1.5)
        .to(".mission-line", { opacity: 1, y: 0, stagger: 0.18, duration: 0.6 }, 1.9);

      // ---- Fase C: Sección 3 → Sección 4 (servicios) ----
      tl.to(".layer-picnic", { opacity: 0, duration: 1 }, 2.7)
        .to(".mission-box", { opacity: 0, duration: 0.8 }, 2.7)
        .to(".layer-s4", { opacity: 1, duration: 0.4 }, 2.75)
        .to(".card-left", { xPercent: 0, opacity: 1, duration: 1 }, 2.85)
        .to(".card-center", { yPercent: 0, opacity: 1, duration: 1 }, 2.85)
        .to(".card-right", { xPercent: 0, opacity: 1, duration: 1 }, 2.85)
        .to(".card-img", { opacity: 1, stagger: 0.12, duration: 0.6 }, 3.4);
    }, stageRef);

    // ---------- MÓVIL: fade-in simple al entrar en viewport ----------
    mm.add("(max-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>(".m-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none", once: true },
          }
        );
      });
    }, mobileRef);

    // ---------- Secciones 5-7: fade-ins (ambos modos) ----------
    const ctxRest = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none", once: true },
          }
        );
      });
    }, restRef);

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      ctxRest.revert();
    };
  }, []);

  return (
    <>
      {/* ===================== ESCRITORIO: STAGE ANIMADO ===================== */}
      <div ref={stageRef} className="stage" aria-hidden={false}>
        <div className="layer layer-blush" />

        {/*
          SECCIÓN 1 — Hero
          CAMBIOS vs v1:
          - El video tiene transform: scaleX(-1) en CSS → espejo horizontal
          - Se agregó el bloque HeroContent (sin botón)
          - El botón CTA está ahora FUERA de kiori-container,
            posicionado absolutamente al fondo y centrado horizontalmente
        */}
        <div className="layer layer-hero">
          <video className="hero-video" autoPlay muted loop playsInline poster="">
            <source src="/landing/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />

          {/* Texto del hero: logo + eyebrow + título */}
          <div className="kiori-container hero-inner">
            <HeroContent />
          </div>

          {/*
            NUEVO: Botón CTA separado del texto, posicionado al fondo centrado.
            Usa btn-pill (base) + btn-hero-cta (colores/fuente) + hero-cta-bottom (posición).
          */}
          <Link href="/registrarse" className="btn-pill btn-hero-cta hero-cta-bottom">
            {TXT.heroCta}
          </Link>
        </div>

        {/* Sección 2 — Espacio de bienestar (sin cambios) */}
        <div className="layer layer-s2">
          <div className="kiori-container s2-scene">
            <Section2Content />
          </div>
        </div>

        {/* Sección 3 — Misión y visión (sin cambios) */}
        <div className="layer layer-picnic">
          <div className="kiori-container mission-inner">
            <MissionBox />
          </div>
        </div>

        {/* Sección 4 — Servicios (sin cambios) */}
        <div className="layer layer-s4">
          <div className="kiori-container">
            <ServiciosContent />
          </div>
        </div>
      </div>

      {/* ===================== MÓVIL: SECCIONES APILADAS ===================== */}
      <div ref={mobileRef} className="mobile-stack">
        <section className="m-hero">
          {/* El video en móvil también va en espejo via CSS */}
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/landing/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="kiori-container hero-inner m-reveal">
            <HeroContent />
          </div>
          {/* Botón al fondo también en móvil */}
          <Link href="/registrarse" className="btn-pill btn-hero-cta hero-cta-bottom m-reveal">
            {TXT.heroCta}
          </Link>
        </section>

        <section className="m-section m-s2">
          <div className="kiori-container m-reveal"><Section2Content /></div>
        </section>

        <section className="m-section m-picnic">
          <div className="kiori-container mission-inner m-reveal"><MissionBox /></div>
        </section>

        <section className="m-section m-s4">
          <div className="kiori-container m-reveal"><ServiciosContent /></div>
        </section>
      </div>

      {/* ===================== SECCIONES 5-7 (scroll normal, sin cambios) ===================== */}
      <div ref={restRef}>
        <section className="catalog">
          <div className="catalog-hero reveal">
            <img className="catalog-img" src="/landing/products-flatlay.jpg" alt="Productos Kiori" />
            <Link href="/tienda" className="btn-pill btn-light catalog-cta">{TXT.catalogCta}</Link>
          </div>
          <div className="kiori-container catalog-cols reveal">
            {TXT.catalogCols.map((c, i) => (
              <div key={i} className="catalog-col">
                <p>{c}</p>
              </div>
            ))}
          </div>
          <div className="kiori-container collection-grid reveal">
            <div className="coll-card coll-photo">
              <img src="/landing/yoga-pose.jpg" alt="Colección Kiori" />
              <span className="coll-link">VER COLECCIÓN →</span>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="coll-card placeholder-card">
                <span className="coll-link dark">VER COLECCIÓN →</span>
              </div>
            ))}
          </div>
          <div className="kiori-container collection-row reveal">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="coll-mini placeholder-card" />
            ))}
          </div>
        </section>

        <section className="clases">
          <div className="clases-banner reveal">
            <img src="/landing/purple-mat.jpg" alt="Clases de Kiori" />
          </div>
          <div className="kiori-container clases-head reveal">
            <h2 className="clases-title">
              <span className="italic-accent">{TXT.clasesTitle1}</span> {TXT.clasesTitle2}
            </h2>
            <p className="clases-subtitle">{TXT.clasesSubtitle}</p>
          </div>
          <div className="kiori-container clases-row reveal">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="clase-card placeholder-card" />
            ))}
          </div>
        </section>

        <section className="signup reveal">
          <SignupSection />
        </section>
      </div>

      <LandingStyles />
    </>
  );
}

// ---- Sección de registro (sin cambios) ----
function SignupSection() {
  return (
    <div className="kiori-container signup-grid">
      <div className="signup-left">
        <img className="signup-logo" src="/landing/logo-teal.png" alt="Kiori" />
        <img className="signup-illu" src="/landing/signup-illustration.png" alt="" />
      </div>
      <div className="signup-right">
        <h2 className="signup-title">
          {TXT.signupTitle1}<br />
          <span className="italic-accent">{TXT.signupTitle2}</span>
        </h2>
        <form className="signup-form" action="/registrarse">
          <label className="field-label">NOMBRE</label>
          <input className="field-input" type="text" name="name" />
          <label className="field-label">CORREO</label>
          <input className="field-input" type="email" name="email" />
          <label className="field-label">CONTRASEÑA</label>
          <input className="field-input" type="password" name="password" />
          <label className="field-label">REPETIR CONTRASEÑA</label>
          <input className="field-input" type="password" name="password2" />
          <div className="signup-actions">
            <label className="remember">
              <input type="checkbox" /> <span>RECORDAR USUARIO</span>
            </label>
            <Link href="/registrarse" className="btn-pill btn-sage signup-btn">
              <span className="signup-icon">⇨</span> SIGN UP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Estilos del landing ----
function LandingStyles() {
  return (
    <style jsx global>{`
      /* ====== Visibilidad escritorio / móvil ====== */
      .mobile-stack { display: none; }
      @media (max-width: 768px) {
        .stage { display: none !important; }
        .mobile-stack { display: block; }
      }

      /* ====== STAGE (escritorio) ====== */
      .stage {
        position: relative;
        height: 100vh;
        width: 100%;
        overflow: hidden;
      }
      .layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100vh;
      }
      .layer-blush { background: var(--color-blush); z-index: 1; }
      .layer-hero { z-index: 2; }
      .layer-s2 { z-index: 3; display: flex; align-items: center; }
      .layer-picnic {
        z-index: 4;
        background: url("/landing/mission-picnic.jpg") center/cover no-repeat;
        display: flex; align-items: center;
      }
      .layer-s4 { z-index: 6; display: flex; align-items: center; background: var(--color-blush); }

      /* ====== HERO VIDEO: ESPEJO HORIZONTAL ====== */
      /*
        scaleX(-1) refleja el video sobre el eje Y.
        Resultado: la mujer que estaba a la izquierda queda a la derecha,
        dejando el espacio limpio del lado izquierdo para el texto.
        Esto aplica igual en escritorio y en móvil (misma clase .hero-video).
      */
      .hero-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1); /* CAMBIO: espejo horizontal */
      }

      /* ====== HERO OVERLAY ====== */
      /*
        Overlay ligeramente más opaco que v1 (.35 → .55) para que el texto
        sea más legible sobre el video sin que se pierda la imagen de fondo.
        El gradiente va de izquierda (donde está el texto) hacia la derecha
        (donde está la mujer), desapareciendo suavemente al 65%.
      */
      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          rgba(237,230,233,.55) 0%,   /* más opaco sobre el área de texto */
          rgba(237,230,233,.15) 65%,  /* semitransparente en la mitad */
          rgba(237,230,233,0) 85%     /* completamente transparente hacia la derecha */
        );
      }

      .hero-inner {
        position: relative;
        z-index: 2;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center; /* centrado vertical */
      }

      /* ====== LOGO EN EL HERO ====== */
      /*
        Bloque nuevo: el logo de Kiori (icono + texto) aparece aquí,
        antes del eyebrow, dentro del stack de texto del hero.
        La clase hero-brand-img tiene un tamaño generoso para
        que sea "grande" como en el target.

        NOTA: si tu logo horizontal se ve extraño en este tamaño,
        crea/usa una versión stacked (icono arriba, KIORI abajo)
        y cambia el src a esa ruta.
      */
      .hero-brand {
        margin-bottom: 1.4rem;
      }
      .hero-brand-img {
        /* Ajustable según si el logo es horizontal o apilado */
        height: clamp(3.5rem, 6vw, 5.5rem);
        width: auto;
        display: block;
      }

      /* ====== HERO EYEBROW ====== */
      /*
        CAMBIOS vs v1:
        - font-family: Raleway (asegúrate de que esté configurado en tu proyecto,
          ya sea via next/font o import en globals.css)
        - font-size: clamp sube de (.6rem–.8rem) a (.85rem–1.1rem) → más visible
        - letter-spacing: baja de .22em a .14em → más compacto, acorde al target
      */
      .hero-eyebrow {
        font-family: 'Raleway', var(--font-display), sans-serif;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-size: clamp(.85rem, 1.4vw, 1.1rem);
        color: var(--color-sage);
        margin: 0 0 .9rem;
      }

      .hero-title { line-height: .98; margin: 0; }

      /* ====== TÍTULOS HERO: MÁS COMPACTOS ====== */
      /*
        letter-spacing negativo (-0.03em) comprime el espacio entre letras,
        dando ese efecto "casi rectangular" o "apretado" del diseño target.
        Antes era .01em (muy ligeramente expandido).
      */
      .hero-line1 {
        display: block;
        font-family: var(--font-display);
        font-weight: 700;
        color: var(--color-sage);
        font-size: clamp(2.6rem, 7vw, 6rem);
        letter-spacing: -0.03em; /* CAMBIO: antes .01em */
      }
      .hero-line2 {
        display: block;
        font-size: clamp(2.6rem, 7vw, 6rem);
        line-height: .95;
        letter-spacing: -0.03em; /* CAMBIO: misma compactación */
      }

      /* ====== BOTÓN CTA DEL HERO: ESTILO ====== */
      /*
        Clase nueva que reemplaza btn-nude para el hero.
        - background: var(--color-rose) → rosa suave del sistema de colores
        - color: #1a1a1a → negro (no blanco)
        - font-family: Raleway thin (weight 300)
        - letter-spacing: .16em → mantiene el tracking de botón tipo pill
        Se combina con .btn-pill (que aporta el border-radius y padding base)
        y con .hero-cta-bottom (que aporta la posición absoluta).
      */
      .btn-hero-cta {
        background: var(--color-rose);
        color: #1a1a1a;
        font-family: 'Raleway', var(--font-display), sans-serif;
        font-weight: 300;         /* delgada, no bold */
        letter-spacing: .16em;
        border: none;
        font-size: clamp(.72rem, .95vw, .85rem);
        transition: background .25s ease, color .25s ease;
      }
      .btn-hero-cta:hover {
        background: var(--color-nude-deep);
        color: #fff;
      }

      /* ====== POSICIÓN DEL BOTÓN CTA: FONDO CENTRADO ====== */
      /*
        position: absolute dentro del .layer-hero (que es position: absolute; inset: 0).
        left: 50% + transform: translateX(-50%) = centrado horizontal exacto.
        bottom: clamp sitúa el botón a entre 2rem y 4.5rem del borde inferior.
        z-index: 10 para que quede por encima del video, overlay y texto.
        white-space: nowrap evita que el texto del botón salte de línea.
      */
      .hero-cta-bottom {
        position: absolute;
        bottom: clamp(2rem, 5vh, 4.5rem);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 10;
      }

      /* ====== SECCIÓN 2 ====== */
      .s2-scene { width: 100%; }
      .s2-grid {
        display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem, 5vw, 5rem);
        align-items: center;
      }
      .s2-title {
        font-size: clamp(1.8rem, 3.4vw, 3rem); line-height: 1.08;
        color: var(--color-sage); font-weight: 700; margin-bottom: 1.5rem;
      }
      .s2-title .italic-accent { font-size: inherit; }
      .s2-paragraph {
        color: var(--color-ink); opacity: .85; max-width: 30rem; line-height: 1.8;
        margin-bottom: 2rem; font-size: clamp(.95rem, 1.2vw, 1.05rem);
      }
      .s2-images { position: relative; height: 30rem; }
      .s2-img { position: absolute; border-radius: 20px; overflow: hidden;
        box-shadow: 0 20px 50px -20px rgba(26,26,26,.4); }
      .s2-img img { width: 100%; height: 100%; object-fit: cover; }
      .s2-img-a { width: 62%; height: 70%; top: 0; right: 6%; z-index: 2; }
      .s2-img-b { width: 56%; height: 60%; bottom: 0; left: 0; z-index: 1; }

      /* ====== SECCIÓN 3 — Misión ====== */
      .mission-inner { width: 100%; }
      .mission-box {
        background: rgba(216,177,171,.86);
        border-radius: var(--radius-lg);
        padding: clamp(1.8rem, 3vw, 3rem);
        max-width: 40rem;
        backdrop-filter: blur(2px);
      }
      .mission-line {
        font-style: italic; color: var(--color-sage);
        font-size: clamp(1rem, 1.5vw, 1.35rem); line-height: 1.7; margin: 0;
      }
      .mission-line b { font-weight: 700; font-style: italic; }

      /* ====== SECCIÓN 4 — Servicios ====== */
      .svc-wrap { width: 100%; text-align: center; }
      .svc-head { margin-bottom: clamp(1.5rem, 3vw, 2.5rem); }
      .svc-title {
        font-size: clamp(2.2rem, 5vw, 4rem); letter-spacing: .28em;
        color: var(--color-accent); font-weight: 700; padding-left: .28em;
      }
      .svc-subtitle {
        text-transform: uppercase; letter-spacing: .15em; color: var(--color-sage);
        font-size: clamp(.65rem, 1vw, .82rem); margin-top: .75rem;
      }
      .svc-cards {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: clamp(1rem, 2.5vw, 2.2rem); max-width: 60rem; margin: 0 auto;
      }
      .svc-card {
        background: var(--color-rose); border-radius: 22px;
        padding: 1.6rem 1.2rem 1.8rem; display: flex; flex-direction: column;
        align-items: center; gap: 1.4rem; transition: transform .3s ease;
      }
      .svc-card:hover { transform: translateY(-6px); }
      .svc-photo {
        width: 80%; aspect-ratio: 1; border-radius: 50%; overflow: hidden;
        margin-top: -2.6rem; background: var(--color-rose);
      }
      .svc-photo .card-img { width: 100%; height: 100%; object-fit: cover; }
      .svc-label {
        background: var(--color-nude-deep); color: #fff; border-radius: var(--radius-pill);
        padding: .7rem 1.4rem; font-family: var(--font-display); font-weight: 700;
        letter-spacing: .12em; font-size: clamp(.6rem, .85vw, .72rem); line-height: 1.4;
      }

      /* ====== SECCIÓN 5 — Catálogo ====== */
      .catalog { background: var(--color-blush); padding-bottom: clamp(3rem, 6vw, 6rem); }
      .catalog-hero { position: relative; }
      .catalog-img { width: 100%; height: clamp(20rem, 42vw, 34rem); object-fit: cover; }
      .catalog-cta { position: absolute; top: 42%; left: clamp(1.5rem, 6vw, 7rem); }
      .catalog-cols {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
        padding-top: clamp(2rem, 4vw, 3rem); padding-bottom: clamp(2rem, 4vw, 3rem);
      }
      .catalog-col { padding: 0 clamp(1rem, 2.5vw, 2.5rem); }
      .catalog-col + .catalog-col { border-left: 1px solid rgba(63,91,90,.25); }
      .catalog-col p {
        color: var(--color-sage); font-style: italic; line-height: 1.8;
        font-size: clamp(.95rem, 1.2vw, 1.1rem); margin: 0;
      }
      .collection-grid {
        display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: clamp(1rem, 2vw, 1.6rem);
        margin-bottom: clamp(1rem, 2vw, 1.6rem);
      }
      .coll-card { border-radius: 16px; overflow: hidden; position: relative; min-height: 12rem; }
      .coll-photo img { width: 100%; height: 100%; object-fit: cover; }
      .coll-link {
        position: absolute; bottom: 1rem; right: 1rem; color: #fff;
        font-family: var(--font-display); font-size: .72rem; letter-spacing: .12em;
      }
      .coll-link.dark { color: var(--color-sage); }
      .collection-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(.6rem, 1.4vw, 1.2rem); }
      .coll-mini { border-radius: 14px; aspect-ratio: 3/4; }

      /* ====== SECCIÓN 6 — Clases ====== */
      .clases { background: var(--color-blush); padding-bottom: clamp(3rem, 6vw, 6rem); }
      .clases-banner { padding: 0 clamp(1.5rem, 5vw, 5rem); }
      .clases-banner img {
        width: 100%; height: clamp(12rem, 24vw, 20rem); object-fit: cover; border-radius: 20px;
      }
      .clases-head { text-align: center; padding: clamp(2rem, 4vw, 3rem) var(--gutter); }
      .clases-title { font-size: clamp(1.6rem, 3vw, 2.4rem); color: var(--color-sage); font-weight: 700; }
      .clases-title .italic-accent { font-size: inherit; }
      .clases-subtitle { color: var(--color-sage); opacity: .85; margin-top: .75rem; }
      .clases-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(.8rem, 1.6vw, 1.4rem); }
      .clase-card { border-radius: 16px; aspect-ratio: 3/4; }

      /* ====== SECCIÓN 7 — Registro ====== */
      .signup { background: var(--color-blush); padding: clamp(3rem, 7vw, 7rem) 0 clamp(3rem, 6vw, 6rem); }
      .signup-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
      .signup-left { display: flex; flex-direction: column; gap: 2rem; align-items: flex-start; }
      .signup-logo { height: 64px; width: auto; }
      .signup-illu { width: clamp(12rem, 18vw, 18rem); height: auto; }
      .signup-title { font-size: clamp(1.8rem, 3.4vw, 3rem); color: var(--color-sage); font-weight: 700; line-height: 1.05; margin-bottom: 2rem; }
      .signup-title .italic-accent { font-size: inherit; }
      .signup-form { display: flex; flex-direction: column; gap: .4rem; max-width: 38rem; }
      .field-label { font-family: var(--font-accent); color: var(--color-nude); letter-spacing: .12em; font-size: .72rem; margin-top: .9rem; }
      .field-input {
        border: 1.5px solid rgba(63,91,90,.55); background: transparent; border-radius: 12px;
        padding: .8rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--color-ink);
        outline: none; transition: border-color .2s ease;
      }
      .field-input:focus { border-color: var(--color-sage); }
      .signup-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 1.4rem; flex-wrap: wrap; gap: 1rem; }
      .remember { display: flex; align-items: center; gap: .5rem; font-family: var(--font-accent); color: var(--color-nude); font-size: .72rem; letter-spacing: .1em; }
      .signup-icon { font-size: 1rem; }

      /* ====== MÓVIL ====== */
      .m-hero { position: relative; height: 100vh; min-height: 560px; }
      .m-section { padding: clamp(3rem, 10vw, 5rem) 0; }
      .m-s2 { background: var(--color-blush); }
      .m-picnic { background: url("/landing/mission-picnic.jpg") center/cover no-repeat; }
      .m-s4 { background: var(--color-blush); }
      @media (max-width: 768px) {
        .s2-grid { grid-template-columns: 1fr; }
        .s2-images { height: 22rem; margin-top: 2rem; }
        .svc-cards { grid-template-columns: 1fr; max-width: 22rem; }
        .catalog-cols { grid-template-columns: 1fr; gap: 1.5rem; }
        .catalog-col + .catalog-col { border-left: none; border-top: 1px solid rgba(63,91,90,.25); padding-top: 1.5rem; }
        .collection-grid { grid-template-columns: 1fr; }
        .collection-row { grid-template-columns: repeat(2, 1fr); }
        .clases-row { grid-template-columns: repeat(2, 1fr); }
        .signup-grid { grid-template-columns: 1fr; }
        .catalog-cta { position: static; display: inline-flex; margin: 1.5rem var(--gutter) 0; }

        /* Ajuste del logo en el hero para móvil */
        .hero-brand-img { height: clamp(2.8rem, 12vw, 4rem); }
      }
    `}</style>
  );
}

/*
  ================================================================
  NOTA IMPORTANTE — NAVBAR LOGO
  ================================================================
  El logo que aparece en el navbar superior vive probablemente en
  un archivo separado como:
    - app/layout.tsx (tu layout raíz)
    - components/Navbar.tsx  o  components/Header.tsx

  Para ocultarlo SOLO en la landing, tienes dos opciones:

  OPCIÓN A (recomendada): En tu componente Navbar, añade una prop
  como `hideLogo?: boolean` y pásala desde la landing o detecta la
  ruta con usePathname():

    import { usePathname } from 'next/navigation';
    const pathname = usePathname();
    const isLanding = pathname === '/';
    // luego: {!isLanding && <Logo />}

  OPCIÓN B (rápida): Añade una clase CSS en el layout de la landing
  y úsala para ocultar el logo del navbar:

    // En layout.tsx, en el <body> de la landing agrega data-page="landing"
    // Luego en globals.css:
    [data-page="landing"] .navbar-logo { display: none; }

  ================================================================
*/