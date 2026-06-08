import PageBanner from "@/components/ui/PageBanner";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata = { title: "Tienda — Kiori" };

// /tienda — Catálogo público. Cualquier visitante puede explorar y usar el
// carrito; el checkout requiere cuenta (kiori_spec.md §6, cambio solicitado).
export default function TiendaPage() {
  return (
    <div className="page">
      <PageBanner title="Tienda" accent="Kiori">
        Piezas y productos elegidos con intención para acompañar tu bienestar.
        Explora libremente; crea tu cuenta al momento de finalizar tu compra.
      </PageBanner>
      <ProductGrid />
    </div>
  );
}
