import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://dami-beauty.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/story`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/legal/gizlilik`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/mesafeli-satis`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/iade-degisim`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/cerez`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
