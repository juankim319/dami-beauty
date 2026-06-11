import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://dami-beauty.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/checkout", "/cart"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
