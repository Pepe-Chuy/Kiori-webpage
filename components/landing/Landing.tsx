"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   LANDING DE KIORI (kiori_spec.md §13)
   ------------------------------------------------------------
   - Las 4 primeras secciones se reproducen tal cual el diseño
     (Landing.svg) y se animan con scroll-driven transitions
     (GSAP + ScrollTrigger, pinned + scrub) en escritorio.
   - En móvil (≤768px) las animaciones se simplifican a fade-in
     al entrar en viewport (sin animaciones direccionales).
   - Las secciones 5-7 (catálogo, clases, registro) continúan en
     scroll normal con fade-ins.
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

// ---- Bloques de contenido reutilizables ----

function HeroContent() {
  return (
    <div className="hero-text">
      <p className="hero-eyebrow">{TXT.heroEyebrow}</p>
      <h1 className="hero-title">
        <span className="hero-line1">{TXT.heroTitle1}</span>
        <span className="italic-accent hero-line2">{TXT.heroTitle2}</span>
      </h1>
      <Link href="/registrarse" className="btn-pill btn-nude hero-cta">{TXT.heroCta}</Link>
    </div>
  );
}

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

      // Estados iniciales
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

    // Recalcula posiciones una vez montado todo (imágenes, fuentes).
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
        {/* base color blanco rosado (siempre presente detrás de las escenas) */}
        <div className="layer layer-blush" />

        {/* Sección 1 — Hero (video de fondo) */}
        <div className="layer layer-hero">
          <video className="hero-video" autoPlay muted loop playsInline poster="">
            <source src="/landing/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="kiori-container hero-inner">
            <HeroContent />
          </div>
        </div>

        {/* Sección 2 — Espacio de bienestar */}
        <div className="layer layer-s2">
          <div className="kiori-container s2-scene">
            <Section2Content />
          </div>
        </div>

        {/* Sección 3 — Misión y visión (fondo fotográfico) */}
        <div className="layer layer-picnic">
          <div className="kiori-container mission-inner">
            <MissionBox />
          </div>
        </div>

        {/* Sección 4 — Servicios */}
        <div className="layer layer-s4">
          <div className="kiori-container">
            <ServiciosContent />
          </div>
        </div>
      </div>

      {/* ===================== MÓVIL: SECCIONES APILADAS ===================== */}
      <div ref={mobileRef} className="mobile-stack">
        <section className="m-hero">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/landing/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="kiori-container hero-inner m-reveal">
            <HeroContent />
          </div>
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

      {/* ===================== SECCIONES 5-7 (scroll normal) ===================== */}
      <div ref={restRef}>
        {/* Sección 5 — Catálogo / colecciones */}
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

        {/* Sección 6 — Clases */}
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

        {/* Sección 7 — Registro / bienvenida */}
        <section className="signup reveal">
          <SignupSection />
        </section>
      </div>

      <LandingStyles />
    </>
  );
}

// ---- Sección de registro (réplica del diseño) ----
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

// ---- Estilos del landing (colocados con el componente) ----
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

      /* ====== HERO ====== */
      .hero-video {
        position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      }
      .hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(90deg, rgba(237,230,233,.35) 0%, rgba(237,230,233,0) 55%);
      }
      .hero-inner {
        position: relative; z-index: 2; height: 100vh;
        display: flex; flex-direction: column; justify-content: center;
      }
      .hero-eyebrow {
        font-family: var(--font-display);
        text-transform: uppercase; letter-spacing: .22em;
        font-size: clamp(.6rem, 1vw, .8rem); color: var(--color-sage);
        margin: 0 0 1rem;
      }
      .hero-title { line-height: .98; margin: 0; }
      .hero-line1 {
        display: block; font-family: var(--font-display); font-weight: 700;
        color: var(--color-sage); font-size: clamp(2.6rem, 7vw, 6rem);
        letter-spacing: .01em;
      }
      .hero-line2 { display: block; font-size: clamp(2.6rem, 7vw, 6rem); line-height: .98; }
      .hero-cta { margin-top: 2.2rem; align-self: flex-start; }

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
      .field-label { font-family: var(--font-display); color: var(--color-nude); letter-spacing: .12em; font-size: .72rem; margin-top: .9rem; }
      .field-input {
        border: 1.5px solid rgba(63,91,90,.55); background: transparent; border-radius: 12px;
        padding: .8rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--color-ink);
        outline: none; transition: border-color .2s ease;
      }
      .field-input:focus { border-color: var(--color-sage); }
      .signup-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 1.4rem; flex-wrap: wrap; gap: 1rem; }
      .remember { display: flex; align-items: center; gap: .5rem; font-family: var(--font-display); color: var(--color-nude); font-size: .72rem; letter-spacing: .1em; }
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
      }
    `}</style>
  );
}
