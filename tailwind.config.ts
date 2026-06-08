import type { Config } from "tailwindcss";

// La config de Tailwind apunta a las mismas variables CSS definidas en globals.css
// para mantener una sola fuente de verdad de la paleta y la tipografía.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "var(--color-sage)",        // Verde salvia
        rose: "var(--color-rose)",        // Rosa palo
        blush: "var(--color-blush)",      // Blanco rosado
        nude: "var(--color-nude)",        // Nude arena
        gray: "var(--color-gray)",        // Gris pálido
        pure: "var(--color-white)",       // Blanco puro
        ink: "var(--color-ink)",          // Negro/texto
      },
      fontFamily: {
        display: ["var(--font-display)"],
        heavy: ["var(--font-heavy)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        site: "1280px",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
