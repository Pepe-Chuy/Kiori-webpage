import Landing from "@/components/landing/Landing";

// Landing page de Kiori (kiori_spec.md §13). El contenido animado vive en el
// componente cliente <Landing /> porque usa GSAP + ScrollTrigger.
export default function HomePage() {
  return <Landing />;
}
