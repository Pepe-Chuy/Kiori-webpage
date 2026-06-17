import type { Metadata } from "next";

// Prevent Next.js from prerendering pages at build time — Supabase client
// requires env vars that are only available at runtime, not during static gen.
export const dynamic = "force-dynamic";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kiori — Energía que inspira",
  description:
    "Kiori es un espacio de bienestar, energía y rituales conscientes. Suscripción mensual, tienda y clases en línea.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
