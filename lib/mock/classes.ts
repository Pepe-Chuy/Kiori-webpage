import type { OnlineClass } from "@/lib/types";

// Clases mock (kiori_spec.md §9). Al lanzamiento se esperan ~2-3 clases.
export const MOCK_CLASSES: OnlineClass[] = [
  {
    id: "class-1",
    title: "Barre",
    description: "Tonifica y activa tu energía con esta clase de barre de bajo impacto.",
    youtubeVideoId: "FCfy7WWt_Gw",
    type: "grabada",
    instructor: "Kiori Studio",
    durationMinutes: 45,
    category: "barre",
    isPublished: true,
  },
  {
    id: "class-2",
    title: "Pilates",
    description: "Fortalece tu core y mejora tu postura con esta sesión de pilates consciente.",
    youtubeVideoId: "BgaLGed5S_k",
    type: "grabada",
    instructor: "Kiori Studio",
    durationMinutes: 40,
    category: "pilates",
    isPublished: true,
  },
  {
    id: "class-3",
    title: "Yoga",
    description: "Una secuencia suave para despertar el cuerpo y conectar con tu respiración.",
    youtubeVideoId: "LN7htrEIctA",
    type: "grabada",
    instructor: "Kiori Studio",
    durationMinutes: 35,
    category: "yoga",
    isPublished: true,
  },
];
