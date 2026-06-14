"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

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
          src="/landing/logo-kiori.png"
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

/* ----------------------------------------------------------------
   COMPONENTE: Section2Content
   CAMBIOS vs v2:
   - Imágenes: de 2 absolute superpuestas → 3 flex-column apiladas
   - Orden imágenes (top → bottom): medit-2, mission-picnic, medit-studio
   - Botón: btn-rose → btn-hero-cta para mantener consistencia de estilo
   ---------------------------------------------------------------- */
function Section2Content() {
  return (
    <div className="s2-grid">
      <div className="s2-text">
        <h2 className="s2-title">
          {TXT.s2Title1} <span className="italic-accent">{TXT.s2Title2}</span>
        </h2>
        <p className="s2-paragraph">{TXT.s2Paragraph}</p>

        {/*
          Botón actualizado a btn-hero-cta para que haga match con
          el estilo rosa/texto negro/Raleway del botón del hero.
        */}
        <Link href="/suscripcion" className="btn-pill btn-hero-cta">{TXT.s2Cta}</Link>
      </div>

      {/*
        CAMBIO ESTRUCTURAL:
        Antes: 2 divs con position absolute (s2-img-a encima, s2-img-b debajo)
               en un contenedor de altura fija (30rem).
        Ahora: 3 divs en flex-column, cada uno con su propio espacio natural.
               Las clases s2-img-a y s2-img-b se eliminaron del CSS.

        Orden según el diseño target (de arriba hacia abajo):
        1. medit-2.jpg        → interior, primera imagen arriba
        2. mission-picnic.jpg → exterior, imagen del medio
        3. medit-studio.jpg   → estudio, imagen de abajo
      */}
      <div className="s2-images">
        <div className="s2-img">
          <img src="/landing/medit-2.jpg" alt="Meditación interior" />
        </div>
        <div className="s2-img">
          <img src="/landing/mission-picnic.jpg" alt="Bienestar al aire libre" />
        </div>
        <div className="s2-img">
          <img src="/landing/medit-studio.jpg" alt="Práctica en estudio" />
        </div>
      </div>
    </div>
  );
}

function MissionBox() {
  /*
    Se mantienen 4 <p> separados porque el GSAP stagger anima cada
    .mission-line con un delay escalonado (cada línea aparece levemente
    después de la anterior). Si fuera un solo <p> no habría efecto.

    Negritas añadidas vs versión anterior:
      + KIORI
      + experiencias, productos  (antes era junto a herramientas)
      + herramientas             (ahora separado)
      + comunidad
      + constante evolución.     (se quitó "en" antes de "constante")
  */
  return (
    <div className="mission-box">
      <p className="mission-line">
        Nuestra <b>misión y visión</b> en <b>KIORI</b> es inspirar y acompañar a las personas a
      </p>
      <p className="mission-line">
        través de <b>experiencias, productos</b> y <b>herramientas</b> de energía consciente,
      </p>
      <p className="mission-line">
        creando una <b>comunidad</b> cercana que transforme el wellness en un estilo de
      </p>
      <p className="mission-line">
        vida <b>auténtico, inspirador</b> y <b>constante evolución.</b>
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
          end: "+=5000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          /*
            SNAP AUTOMÁTICO ENTRE ESCENAS
            ------------------------------------------------------------
            Sin esto el usuario podía soltar el scroll a la mitad de una
            transición y la escena quedaba "atorada" entre dos slides.

            snapTo es la lista de progresos (0..1 del timeline) donde cada
            escena queda totalmente asentada. Derivados de los tiempos del
            timeline (duración total ≈ 3.85):
              0      → Hero
              0.34   → Sección 2  (t≈1.3 / 3.85)
              0.65   → Misión     (t≈2.5 / 3.85)
              1      → Servicios  (t=3.85)

            Al detenerse el scroll, GSAP anima suavemente hasta el punto
            más cercano, así nunca queda a medio camino. duration min/max
            mantiene el ajuste rápido pero no brusco.
          */
          snap: {
            /*
              Puntos recalculados con la nueva duración total ~4.95:
                0    → Hero (t=0)
                0.32 → S2 asentada (t≈1.6 / 4.95)
                0.70 → Misión asentada, texto completo (t≈3.45 / 4.95)
                1    → Servicios (t=4.95)
            */
            snapTo: [0, 0.32, 0.70, 1],
            /*
              directional: true → siempre avanza al SIGUIENTE punto en la
              dirección del scroll (no al más cercano). Un solo tick de
              rueda lleva a la escena siguiente; varias ruedas lentas
              animan gradualmente y al soltarlas aterrizan en la próxima.
            */
            directional: true,
            duration: { min: 0.5, max: 1.2 },
            delay: 0,
            ease: "power2.inOut",
          },
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
      /*
        FIX v9: se eliminó `gsap.set(".card-img", { opacity: 0 })`.
        Ese set ocultaba las fotos circulares y solo las revelaba al 85%
        del scroll del stage. Si el usuario no scrolleaba hasta el final,
        las imágenes nunca aparecían. Las cards ya tienen su propia
        animación de entrada (xPercent/yPercent), no hace falta animar
        además la opacidad de la foto interior.
      */

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
      /*
        ANTES el fade-out empezaba en t=2.7, pero el texto de misión
        termina de aparecer en t≈3.04 (4 líneas × stagger 0.18 + duration 0.6,
        arrancando en t=1.9). El picnic empezaba a desaparecer antes de que
        la última línea terminara de aparecer.

        AHORA: Phase C empieza en t=3.8 → ~0.75s de margen tras el último
        fade-in del texto, suficiente para leer la sección completa.
      */
      tl.to(".layer-picnic", { opacity: 0, duration: 1 }, 3.8)
        .to(".mission-box", { opacity: 0, duration: 0.8 }, 3.8)
        .to(".layer-s4", { opacity: 1, duration: 0.4 }, 3.85)
        .to(".card-left", { xPercent: 0, opacity: 1, duration: 1 }, 3.95)
        .to(".card-center", { yPercent: 0, opacity: 1, duration: 1 }, 3.95)
        .to(".card-right", { xPercent: 0, opacity: 1, duration: 1 }, 3.95);
        /* (eliminada la animación de opacity de .card-img — ver comentario arriba) */
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
          {/*
            Estos bloques antes usaban placeholder-green. Ahora muestran
            productos reales de la tienda (mismos datos que /tienda vía
            MOCK_PRODUCTS), enlazando al catálogo.
          */}
          <div className="kiori-container collection-grid reveal">
            <Link href="/tienda" className="coll-card coll-photo">
              <img src="/landing/yoga-pose.jpg" alt="Colección Kiori" />
              <span className="coll-link">VER COLECCIÓN →</span>
            </Link>
            {MOCK_PRODUCTS.slice(0, 2).map((p) => (
              <Link key={p.id} href="/tienda" className="coll-card coll-photo">
                <img src={p.imageUrl} alt={p.name} />
                <span className="coll-cap">
                  {p.name}
                  <b>${p.price} MXN</b>
                </span>
              </Link>
            ))}
          </div>
          <div className="kiori-container collection-row reveal">
            {MOCK_PRODUCTS.slice(2, 7).map((p) => (
              <Link key={p.id} href="/tienda" className="coll-mini" aria-label={p.name}>
                <img src={p.imageUrl} alt={p.name} />
                <span className="coll-cap mini">{p.name}</span>
              </Link>
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
        <img className="signup-logo" src="/landing/logo-kiori.png" alt="Kiori" />
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
              <span className="signup-icon">⇨</span> REGÍSTRATE
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
        display: flex;
        /*
          CAMBIO: center → flex-end
          flex-end empuja el kiori-container al borde inferior del layer.
          Resultado: el mission-box "toca" el borde inferior de la sección.
        */
        align-items: flex-end;
      }

      /*
        Override puntual: el kiori-container normalmente puede tener
        padding-bottom. Lo anulamos SOLO dentro del layer-picnic para
        que el mission-box quede exactamente al ras del borde inferior.
      */
      .layer-picnic .kiori-container {
        padding-bottom: 0;

        /*
          ── AJUSTE MANUAL DE POSICIÓN HORIZONTAL ──────────────────────────
          Este padding-left es el único valor que necesitas cambiar para
          mover el box a izquierda o derecha.

          Referencia de valores:
            0rem       → box pegado al borde izquierdo de la pantalla
            1rem       → ligeramente separado del borde
            2rem       → más hacia la derecha (valor actual)
            3rem–4rem  → posición del gutter estándar del sitio

          Reduce el número para moverlo a la izquierda,
          auméntalo para moverlo a la derecha.
          ──────────────────────────────────────────────────────────────────
        */
        padding-left: 2rem;
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
        /*
          CAMBIO: el botón sube desde el borde inferior hasta quedar a
          media altura entre el texto del hero (centrado verticalmente,
          ~50vh) y el borde inferior de la pantalla. ~22vh desde abajo
          ≈ punto medio de esa franja.
        */
        bottom: clamp(3.5rem, 11vh, 7.5rem);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 10;
      }

      /* ====== SECCIÓN 2 ====== */
      .s2-scene { width: 100%; }

      /*
        CAMBIO: grid-template-columns pasa de 1.1fr 1fr a 1.3fr 1fr.
        Esto le da más espacio al texto (57%) y menos a las imágenes (43%),
        que es la proporción que se ve en el diseño target.

        align-items: start (antes: center) → texto e imágenes alinean
        desde el top, igual que en el target.
      */
      .s2-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: clamp(2rem, 4vw, 4rem);
        align-items: start;
      }
      .s2-title {
        font-size: clamp(1.8rem, 3.4vw, 3rem); line-height: 1.08;
        color: var(--color-sage); font-weight: 700; margin-bottom: 1.5rem;
      }
      .s2-title .italic-accent { font-size: inherit; }
      .s2-paragraph {
        /* Raleway, verde salvia de la marca y tamaño mayor (pedido del cliente) */
        font-family: 'Raleway', var(--font-body), sans-serif;
        color: var(--color-sage); opacity: 1; max-width: 34rem; line-height: 1.75;
        margin-bottom: 2rem; font-size: clamp(1.15rem, 1.7vw, 1.5rem);
      }

      /*
        CAMBIO COMPLETO en el layout de imágenes:

        ANTES (v1-v2): un contenedor de altura fija (30rem) con 2 hijos
          position:absolute escalonados. Problema: depende de height fija
          y las imágenes se superponen manualmente.

        AHORA (v3): flex-column con gap uniforme entre las 3 imágenes.
          Cada imagen tiene aspect-ratio: 4/3 para mantener proporciones
          consistentes sin importar el ancho de la columna.

        Las clases s2-img-a y s2-img-b se eliminan — ya no se usan.

        PROBLEMA que se corrige en v4:
        aspect-ratio: 4/3 hacía que cada imagen fuera tan alta como ancha × 0.75.
        Si la columna mide ~520px → cada imagen ~390px → 3 fotos = 1170px. Desborda 100vh.

        SOLUCIÓN v4:
        El contenedor (.s2-images) recibe una altura calculada del viewport.
        Cada hijo (.s2-img) usa flex: 1 para repartirse esa altura en 3 partes iguales.
        La imagen usa height: 100% para llenar su contenedor y object-fit: cover para recortar.
      */
      .s2-images {
        display: flex;
        flex-direction: column;
        gap: clamp(.4rem, .55vw, .6rem);
        /*
          76vh ≈ espacio útil de la sección después de navbar y padding.
          clamp: mínimo 22rem, ideal 76vh, máximo 38rem para pantallas grandes.
        */
        height: clamp(22rem, 76vh, 38rem);
      }

      .s2-img {
        /*
          flex: 1 → cada .s2-img toma exactamente 1/3 del alto de .s2-images.
          min-height: 0 → CRÍTICO. Sin esto un flex item no puede encogerse por
          debajo del tamaño natural de su contenido (la imagen sin recortar).
          Con min-height: 0, overflow: hidden puede cortar correctamente.
        */
        flex: 1;
        min-height: 0;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 6px 20px -4px rgba(26,26,26,.2);
      }

      .s2-img img {
        width: 100%;
        height: 100%;     /* llena el flex item completo */
        object-fit: cover;
        display: block;   /* elimina el gap inline que los <img> generan por defecto */
      }

      /*
        object-position controla QUÉ parte de la imagen queda visible cuando
        object-fit: cover recorta para rellenar el contenedor.

        El valor acepta palabras clave (top, center, bottom) o porcentajes X% Y%:
          X% = posición horizontal (0=izquierda, 50=centro, 100=derecha)
          Y% = posición vertical   (0=arriba de la imagen, 100=abajo)

        CORRECCIÓN v5:
        Con "bottom", el ancla se pone en la parte inferior de la imagen y
        se recorta desde arriba. Para la foto del picnic y medit-studio,
        el sujeto principal está en el tercio superior/central del original,
        así que "bottom" mostraba demasiado suelo/pasto.

        Ajuste: 50% 30% y 50% 25% mueven el punto de anclaje hacia arriba,
        centrando el encuadre sobre la persona en lugar del suelo.

        Si sigue sin quedar perfecto, puedes afinar el segundo número:
          más alto (ej. 50% 10%) → sube más el encuadre, ves la parte superior
          más bajo  (ej. 50% 60%) → baja, ves más la parte inferior
      */
      .s2-img:nth-child(1) img { object-position: center; }        /* medit-2: partes iguales       */
      .s2-img:nth-child(2) img { object-position: 50% 65%; }       /* mission-picnic: sube el crop  */
      .s2-img:nth-child(3) img { object-position: 50% 55%; }       /* medit-studio: muestra persona */

      /* ====== SECCIÓN 3 — Misión ====== */
      .mission-inner { width: 100%; }
      .mission-box {
        /*
          Color más saturado e intenso vs la versión anterior (216,177,171,.86).
          Se bajan G y B para darle más cuerpo al rosa/mauve y se sube
          la opacidad a .94 para que el texto sea más legible sobre la foto.
          Resultado: rosa cálido más cercano al target.
        */
        background: rgba(210,148,141,.94);
        border-radius: var(--radius-lg);
        padding: clamp(1.8rem, 3vw, 3rem);
        max-width: 40rem;
        backdrop-filter: blur(2px);
      }
      .mission-line {
        font-style: italic; color: var(--color-sage);
        /*
          Tamaño aumentado: de clamp(1rem, 1.5vw, 1.35rem)
                          a clamp(1.1rem, 1.7vw, 1.5rem)
          El mínimo sube de 1rem a 1.1rem (pantallas pequeñas)
          El ideal sube de 1.5vw a 1.7vw (pantallas medias)
          El máximo sube de 1.35rem a 1.5rem (pantallas grandes)
        */
        font-size: clamp(1.1rem, 1.7vw, 1.5rem);
        line-height: 1.65;
        margin: 0;
        text-align: justify;
      }
      .mission-line b { font-weight: 700; font-style: italic; }

      /* ====== SECCIÓN 4 — Servicios ====== */
      /*
        Reescritura completa basada en el SVG target.
        Datos extraídos del SVG (clipPath de cada card):
          ancho: 240, alto: 353, ratio ≈ 0.68 (rectángulo vertical alargado)
          border-radius: 27px (≈11% del ancho)
      */
      .svc-wrap { width: 100%; text-align: center; }
      .svc-head { margin-bottom: clamp(2rem, 4vw, 3rem); }

      /* ── TÍTULO ────────────────────────────────────────────── */
      /*
        CAMBIOS:
        - color: nude/terracotta (--color-accent) → sage (--color-sage)
          En el target "SERVICIOS" es del mismo verde-sage que el resto del sitio.
        - font-size: subido para que tenga más peso visual.
        - letter-spacing: bajado un toque (.28em → .22em) — el target
          tiene tracking ancho pero no tan extremo.
      */
      .svc-title {
        font-size: clamp(2.6rem, 5.5vw, 4.5rem);
        letter-spacing: .22em;
        color: var(--color-sage);
        font-weight: 700;
        padding-left: .22em;
        margin: 0;
      }

      /* ── SUBTÍTULO ─────────────────────────────────────────── */
      /*
        El subtítulo del target rompe a 2 líneas:
        "OPCIONES CREADAS PARA ACOMPAÑARTE / EN TU CAMINO DE BIENESTAR"
        Le doy un max-width para forzar ese wrap naturalmente.
      */
      .svc-subtitle {
        text-transform: uppercase;
        letter-spacing: .12em;
        color: var(--color-sage);
        font-size: clamp(.75rem, 1.05vw, .9rem);
        margin: .9rem auto 0;
        max-width: 28rem;
        line-height: 1.6;
      }

      /* ── GRID DE CARDS ─────────────────────────────────────── */
      /*
        CAMBIO v10:
        - gap subido para más separación visual entre cards
          (1rem-2rem) → (1.8rem-3.5rem)
        - max-width subido (56rem → 64rem) → el bloque ocupa más espacio horizontal
      */
      .svc-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(1.8rem, 3.5vw, 3.5rem);
        max-width: 64rem;
        margin: 0 auto;
      }

      /* ── CARD INDIVIDUAL ───────────────────────────────────── */
      /*
        CAMBIOS clave:
        - aspect-ratio: 0.68 (calcado del SVG) → cards rectangulares verticales
        - box-shadow más pronunciada (offset 16px, blur 36px) → da volumen
        - justify-content: space-between → la foto sube al top, el botón baja al bottom
        - gap eliminado: el espacio entre foto y botón viene de space-between

        CAMBIO v10/v11:
        - border: 3px solid #d99c93 → marco rojo pastel pedido por el usuario.
          v10 era 2px #e4b1aa, demasiado parecido al --color-rose y se
          confundía con el fondo. v11 sube a 3px y usa un tono levemente
          más saturado (#d99c93) para que sea inconfundible.
          Si después de verlo quieres que sea más sutil, baja a 2px y/o
          ajusta el hex hacia tonos más claros (ej. #e4b1aa o #e8b8b0).
      */
      .svc-card {
        background: var(--color-rose);
        border: 15px solid #d99c93; /* marco rojo pastel saturado — 5x más grueso (era 3px) */
        border-radius: 24px;
        padding: 1.6rem 1.2rem 1.8rem;
        aspect-ratio: 0.68; /* del SVG: 240/353 */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between; /* foto arriba, botón abajo */
        /* Sombra más fuerte y oscura para dar profundidad a la card */
        box-shadow: 0 18px 40px -12px rgba(0,0,0,0.28),
                    0 6px 16px -6px rgba(0,0,0,0.15);
        transition: transform .3s ease, box-shadow .3s ease;
        text-decoration: none;
      }
      .svc-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 24px 50px -12px rgba(0,0,0,0.32),
                    0 8px 20px -6px rgba(0,0,0,0.18);
      }

      /* ── FOTO CIRCULAR ─────────────────────────────────────── */
      /*
        v11: Anulación FORZADA de sombras/filtros sobre el círculo y su imagen.
        Si la "medialuna" persiste después de esto, no viene del CSS —
        probablemente está horneada en el archivo PNG (sombra exportada
        desde el diseño original). En ese caso habría que re-exportar
        el PNG sin la sombra.

        Uso de !important: forzamos sobreescritura de cualquier otra regla
        (heredada, de Tailwind, de un wrapper, o de versión cacheada).
      */
      .svc-photo {
        width: 88%;
        aspect-ratio: 1;
        border-radius: 50%;
        /* overflow visible: las PNGs ya tienen el recorte circular horneado con
           fondo transparente, así que pelo, cabeza y estrellas que sobresalen
           del círculo se ven fuera de él en lugar de ser cortados */
        overflow: visible;
        background: var(--color-rose);
        margin-top: .5rem;
        box-shadow: none !important;
        filter: none !important;
        outline: none !important;
      }
      .svc-photo .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        box-shadow: none !important;
        filter: none !important;
        transform: scale(1.18);  /* zoom suave, recortado por el overflow:hidden del círculo */
      }

      /* ── BOTÓN (LABEL) ─────────────────────────────────────── */
      /*
        CAMBIOS pedidos:
        - "Letras delgadas" → font-family Raleway, font-weight 300 (thin)
        - "Óvalos más alargados" → más padding horizontal (1.4rem → 2.2rem)
        - Mantener color nude/terracotta con texto blanco
        - Letter-spacing ligeramente reducido para look más limpio
      */
      .svc-label {
        background: var(--color-nude-deep);
        color: #fff;
        border-radius: 999px; /* full pill */
        padding: .85rem 2.2rem;
        font-family: 'Raleway', var(--font-display), sans-serif;
        font-weight: 300; /* delgada, no bold */
        letter-spacing: .08em;
        font-size: clamp(.7rem, .9vw, .8rem);
        line-height: 1.4;
        text-align: center;
        text-transform: uppercase;
        margin-bottom: .4rem;
        white-space: nowrap;
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
      .coll-card { border-radius: 16px; overflow: hidden; position: relative; min-height: 12rem; display: block; text-decoration: none; }
      .coll-photo img { width: 100%; height: 100%; object-fit: cover; }
      .coll-link {
        position: absolute; bottom: 1rem; right: 1rem; color: #fff;
        font-family: var(--font-display); font-size: .72rem; letter-spacing: .12em;
      }
      .coll-link.dark { color: var(--color-sage); }
      /* Etiqueta de producto (nombre + precio) sobre la imagen de la tienda */
      .coll-cap {
        position: absolute; left: 0; right: 0; bottom: 0;
        padding: 1.6rem .95rem .85rem;
        background: linear-gradient(transparent, rgba(26,26,26,.7));
        color: #fff; font-family: var(--font-display);
        font-size: .92rem; letter-spacing: .03em; line-height: 1.3;
        display: flex; flex-direction: column; gap: .15rem;
      }
      .coll-cap b { font-weight: 700; font-size: .85rem; opacity: .95; }
      .coll-cap.mini { padding: 1rem .55rem .5rem; font-size: .7rem; letter-spacing: .02em; }
      .collection-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: clamp(.6rem, 1.4vw, 1.2rem); }
      .coll-mini { border-radius: 14px; aspect-ratio: 3/4; position: relative; overflow: hidden; display: block; text-decoration: none; }
      .coll-mini img { width: 100%; height: 100%; object-fit: cover; }

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
        /*
          En móvil no hay pin de GSAP → las imágenes pueden tener altura natural.
          Reseteamos height: auto y flex: none para que cada imagen use su propia altura.
        */
        .s2-images { height: auto; gap: .4rem; }
        .s2-img { flex: none; }
        .s2-img img { height: clamp(8rem, 38vw, 14rem); }
        /*
          En móvil 1 sola columna. Anulo el aspect-ratio porque a ancho completo
          (~22rem) la card resultaría exageradamente alta. En su lugar uso
          min-height para mantener proporción razonable.
        */
        .svc-cards { grid-template-columns: 1fr; max-width: 22rem; }
        .svc-card { aspect-ratio: auto; min-height: 22rem; }
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