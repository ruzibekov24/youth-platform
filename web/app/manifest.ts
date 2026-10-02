import type { MetadataRoute } from "next";
import { t } from "@/lib/strings.uz";

// PWA: telefon ekraniga "ilova" sifatida o'rnatish. Service worker yo'q (shaxsiy sahifalar keshda eskirmasin).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: t.brand,
    short_name: t.brand,
    description: t.meta.description,
    lang: "uz",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
