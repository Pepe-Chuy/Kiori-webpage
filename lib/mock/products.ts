import type { Product, ProductCategory } from "@/lib/types";

// Datos mock para desarrollo: 30 productos en 6 categorías (kiori_spec.md §7).
// En producción provienen de MongoDB vía /app/api/products.

const NAMES: Record<ProductCategory, string[]> = {
  Meditación: ["Cojín Zafu", "Set de Mindfulness", "Diario de Gratitud", "Cuenco Tibetano", "Vela de Meditación"],
  Cuarzos: ["Cuarzo Rosa", "Amatista Bruta", "Selenita Pulida", "Cuarzo Cristal", "Obsidiana Negra"],
  Joyería: ["Collar de Cuarzo", "Pulsera de Amatista", "Aretes de Luna", "Anillo Lunar", "Dije de Selenita"],
  Aromaterapia: ["Aceite de Lavanda", "Difusor de Cerámica", "Incienso de Palo Santo", "Bruma de Almohada", "Roll-on Calma"],
  Rituales: ["Kit de Limpieza Energética", "Sahumerio de Salvia", "Set de Velas Rituales", "Baño de Sales", "Tarot de Bolsillo"],
  Accesorios: ["Mat de Yoga", "Bloque de Corcho", "Botella de Cobre", "Bolsa de Lino", "Toalla de Práctica"],
};

const DESCRIPTIONS = [
  "Pieza elegida con intención para acompañar tu ritual diario de bienestar.",
  "Hecho para conectar cuerpo, mente y energía en cada práctica.",
  "Un detalle consciente que eleva tu rutina y tu espacio.",
  "Materiales naturales y energía cuidada en cada terminación.",
  "Inspirado en la calma, diseñado para tu equilibrio personal.",
];

const categoryKeys = Object.keys(NAMES) as ProductCategory[];

export const MOCK_PRODUCTS: Product[] = categoryKeys.flatMap((cat, ci) =>
  NAMES[cat].map((name, ni) => {
    const idx = ci * 5 + ni;
    return {
      id: `prod-${idx + 1}`,
      name,
      description: DESCRIPTIONS[idx % DESCRIPTIONS.length],
      price: 199 + ((idx * 47) % 900),
      categories: [cat],
      quantity: ((idx * 7) % 20) + 3,
      // Reutilizamos imágenes del landing como muestra visual.
      imageUrl: [
        "/landing/products-flatlay.jpg",
        "/landing/medit-1.png",
        "/landing/yoga-pose.jpg",
        "/landing/purple-mat.jpg",
        "/landing/mission-picnic.jpg",
      ][idx % 5],
      isActive: true,
    };
  })
);
