import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { HeroCampaign } from "@/components/shop/HeroCampaign";
import { ProductCard } from "@/components/shop/ProductCard";
import { InstagramGrid } from "@/components/shop/InstagramGrid";
import { getMessages } from "@/lib/i18n";
import type { Product, Campaign, InstagramPost } from "@/types";

export const revalidate = 60;

const t = getMessages();

async function getHomeData() {
  try {
    const [featured, all, campaign, instagram] = await Promise.all([
      apiFetch<Product[]>("/products?featured=true&limit=8"),
      apiFetch<Product[]>("/products?limit=16"),
      apiFetch<Campaign | null>("/campaigns/active").catch(() => null),
      apiFetch<InstagramPost[]>("/instagram").catch(() => []),
    ]);
    const featuredIds = new Set(featured.map((p) => p.id));
    const newArrivals = all.filter((p) => !featuredIds.has(p.id)).slice(0, 8);
    return { featured, newArrivals, campaign, instagram };
  } catch {
    return { featured: [], newArrivals: [], campaign: null, instagram: [] };
  }
}

function SectionHeading({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-7 flex items-baseline justify-between border-b border-dami-200 pb-4 dark:border-dami-700">
      <h2 className="section-title">{title}</h2>
      <Link
        href={href}
        className="text-[10px] font-medium uppercase tracking-[0.2em] text-dami-400 transition-colors hover:text-dami-900 dark:text-dami-500 dark:hover:text-white"
      >
        {t.home.viewAllPlus}
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const { featured, newArrivals, campaign, instagram } = await getHomeData();

  return (
    <>
      <HeroCampaign campaign={campaign} />

      {featured.length > 0 && (
        <section className="px-5 py-14 md:px-10 md:py-16">
          <SectionHeading title={t.home.bestSellerSection} href="/products?featured=true" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-7 md:gap-y-12">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="border-t border-dami-200 px-5 py-14 dark:border-dami-700 md:px-10 md:py-16">
          <SectionHeading title={t.home.newArrivals} href="/products" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-7 md:gap-y-12">
            {newArrivals.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && newArrivals.length === 0 && (
        <section className="px-5 py-20 text-center md:px-10">
          <p className="section-label">{t.brand.name}</p>
          <p className="mt-4 text-sm text-dami-400">{t.home.comingSoon}</p>
          <Link href="/products" className="btn-secondary mt-8 inline-flex">
            {t.nav.products}
          </Link>
        </section>
      )}

      {instagram.length > 0 && (
        <section className="border-t border-dami-200 dark:border-dami-700">
          <div className="px-5 md:px-10">
            <InstagramGrid posts={instagram} />
          </div>
        </section>
      )}
    </>
  );
}
