import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dami Beauty",
    short_name: "Dami Beauty",
    description: "Hediye kutusunu açtığınız an mutluluk başlar.",
    start_url: "/",
    display: "standalone",
    background_color: "#2a1219",
    theme_color: "#2a1219",
    orientation: "portrait",
    lang: "tr",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
