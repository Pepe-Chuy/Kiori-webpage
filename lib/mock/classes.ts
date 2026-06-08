import type { OnlineClass } from "@/lib/types";

// Clases mock (kiori_spec.md §9). Al lanzamiento se esperan ~2-3 clases.
export const MOCK_CLASSES: OnlineClass[] = [
  {
    id: "class-1",
    title: "Yoga para empezar el día",
    description: "Una secuencia suave para despertar el cuerpo y conectar con tu respiración.",
    youtubeVideoId: "v7AYKMP6rOE",
    type: "grabada",
    instructor: "Ana Robles",
    durationMinutes: 35,
    category: "yoga",
    isPublished: true,
  },
  {
    id: "class-2",
    title: "Barre & energía",
    description: "Tonifica y activa tu energía con esta clase de barre de bajo impacto.",
    youtubeVideoId: "ml6cT4AZdqI",
    type: "grabada",
    instructor: "Lucía Fernández",
    durationMinutes: 45,
    category: "barre",
    isPublished: true,
  },
  {
    id: "class-3",
    title: "Meditación guiada en vivo",
    description: "Sesión en vivo de meditación consciente para cerrar la semana en calma.",
    youtubeVideoId: "inpok4MKVLM",
    type: "en-vivo",
    instructor: "Kiori Studio",
    durationMinutes: 25,
    category: "meditacion",
    isPublished: true,
  },
];
