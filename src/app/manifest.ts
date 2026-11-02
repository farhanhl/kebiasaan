import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kebiasaan",
    short_name: "Kebiasaan",
    description: "Catat kebiasaan baik dan burukmu, pantau progresnya, naik level.",
    lang: "id",
    start_url: "/hari-ini",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1C1917",
    theme_color: "#1C1917",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

