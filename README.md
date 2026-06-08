# Kiori — _Energía que inspira_

Tienda de bienestar (suscripción mensual + tienda individual + clases en línea)
construida con **Next.js (App Router) + TypeScript**, según `kiori_spec.md`.

Esta primera iteración entrega el **frontend completo**: el landing animado
reproduciendo fielmente `Landing.svg`, y el resto de las páginas con el estilo de
la paleta de marca. La lógica de backend (MongoDB, NextAuth, Stripe, Cloudinary,
Envía.com, email) está estructurada y lista para conectarse cuando lleguen las
credenciales (ver `.env.example`).

## Cómo correr

```bash
npm install
npm run dev        # http://localhost:3000
```

> Requiere Node 18.17+.

## Cambio solicitado (vs. spec original)

Los **visitantes sin sesión** pueden entrar a la **tienda** y al **carrito**, y el
**carrito persiste** (localStorage) entre recargas e incluso al iniciar sesión.
Para **finalizar la compra (checkout) sí se requiere una cuenta**: el carrito
muestra los botones _Crear cuenta_ / _Ya tengo cuenta_ y, tras autenticarse, el
usuario vuelve al carrito con sus productos intactos y el botón de pago habilitado.

Implementado en:
- `lib/context/CartContext.tsx` — carrito persistente (también para invitados).
- `app/tienda/carrito/page.tsx` — gate de cuenta en el checkout.
- `components/auth/AuthForms.tsx` — soporte de `?redirect=/tienda/carrito`.

## Landing page (fiel a `Landing.svg`)

7 secciones con **animaciones scroll-driven** (GSAP + ScrollTrigger), pinned +
scrub en escritorio y _fade-in_ simplificado en móvil (≤768px), tal como pide la
spec §13:

1. **Hero** — video de fondo (`/landing/hero-video.mp4`), "ENERGÍA QUE _INSPIRA_".
2. **Espacio de bienestar** — texto entra desde la izquierda, imágenes desde la derecha.
3. **Misión y visión** — fondo fotográfico + caja rosa palo que emerge con texto línea por línea.
4. **Servicios** — 3 tarjetas que entran (izq/centro/der) y luego aparecen sus imágenes.
5. **Catálogo** — flatlay + "EXPLORA EL CATÁLOGO" + colecciones.
6. **Clases** — banner + tarjetas placeholder.
7. **Registro** — "BIENVENIDO A _LA COMUNIDAD KIORI_".

Las imágenes y textos se extrajeron del diseño original (`Landing.svg` / `Landing.png`)
y viven en `public/landing/`.

## Estructura

```
app/
  globals.css            # paleta + tipografía como variables CSS (única fuente de verdad)
  layout.tsx             # navbar + footer + providers
  page.tsx               # landing
  tienda/ , suscripcion/ , clases/ , perfil/
  iniciar-sesion/ , registrarse/
  admin/                 # dashboard + pedidos, paquetes, usuarios, productos, clases, devoluciones
components/              # Navbar, Footer, landing/, shop/, auth/, ui/
lib/
  context/               # AuthContext (mock), CartContext (persistente)
  mock/                  # productos y clases de demo
  types.ts , constants.ts
```

## Notas de implementación (mock vs. producción)

- **Auth** y **carrito** usan contextos de React + `localStorage` para que el flujo
  sea demostrable sin backend. La interfaz (`login`, `register`, `logout`) está pensada
  para reemplazarse por **NextAuth.js** sin cambiar los componentes.
- El panel `/admin/*` se protege con un _guard_ de cliente; en producción se usará
  **middleware de Next.js** validando el rol del JWT.
- Las clases usan embeds **`youtube-nocookie.com`** (privacy-enhanced, §9).
- Datos de tienda/clases/pedidos son **mock** (`lib/mock`).

## Pendientes (TBD de la spec §18)

Tipografía **Futura Std** (se usa _Jost_ como fallback geométrico), precios reales,
formulario de preferencias, categorías definitivas, credenciales de integraciones,
y textos/imágenes del footer. Ver `kiori_spec.md` §18 y `.env.example`.
