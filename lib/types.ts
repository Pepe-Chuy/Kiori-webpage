// Tipos compartidos del frontend de Kiori.
// (Reflejan los modelos de Mongoose descritos en kiori_spec.md §5,
//  simplificados para la capa cliente / datos mock.)

export type ProductCategory =
  | "Meditación"
  | "Cuarzos"
  | "Joyería"
  | "Aromaterapia"
  | "Rituales"
  | "Accesorios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // MXN
  categories: ProductCategory[];
  quantity: number;
  imageUrl: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export type SubscriptionStatus = "active" | "canceled" | "paused" | "none";
export type UserRole = "user" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  puntosKiori: number;
  referralCode: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: "mensual" | "trimestral" | "anual" | null;
}

export interface OnlineClass {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  type: "en-vivo" | "grabada";
  instructor: string;
  durationMinutes: number;
  category: string;
  isPublished: boolean;
}
