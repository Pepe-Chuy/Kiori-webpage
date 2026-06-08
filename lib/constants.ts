// Constantes globales de negocio (kiori_spec.md).

export const MAX_REFERRALS_PER_MONTH = 2;
export const REFERRAL_REWARD_PUNTOS = 150; // 150 Puntos Kiori = $150 MXN

// Categorías de la tienda (6 — nombres provisionales, §7 [TBD]).
export const PRODUCT_CATEGORIES = [
  "Meditación",
  "Cuarzos",
  "Joyería",
  "Aromaterapia",
  "Rituales",
  "Accesorios",
] as const;

// Planes de suscripción (precios [TBD] en spec — provisionales para demo).
export const SUBSCRIPTION_PLANS = [
  {
    id: "mensual",
    name: "Mensual",
    billing: "Cada mes",
    price: 549,
    note: "Flexibilidad total, cancela cuando quieras.",
  },
  {
    id: "trimestral",
    name: "Trimestral",
    billing: "Cada 3 meses",
    price: 1499,
    note: "Ahorra con cobro cada trimestre.",
    highlighted: true,
  },
  {
    id: "anual",
    name: "Anual",
    billing: "Cada año",
    price: 5490,
    note: "El mejor precio por caja mensual.",
  },
] as const;

export const SUBSCRIPTION_BENEFITS = [
  "Una caja mensual personalizada según tus preferencias",
  "Acceso completo a clases en vivo y grabadas",
  "Envío gratis al enviar tu compra con tu paquete mensual",
  "Beneficios y promociones exclusivas para suscriptoras",
  "Acumulas Puntos Kiori en cada compra",
];

// Tarifa de envío demo (en producción: API de Envía.com, §15).
export const FLAT_SHIPPING_FEE = 99;
