import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { HeroCampaign } from "@/components/shop/HeroCampaign";
import { ProductCard } from "@/components/shop/ProductCard";
import { InstagramGrid } from "@/components/shop/InstagramGrid";
import { getMessages } from "@/lib/i18n";
import type { Product, Campaign, InstagramPost, ProductType } from "@/types";

export const revalidate = 60;

const t = getMessages();

async function getHomeData() {
  try {
    const [products, campaign, instagram] = await Promise.all([
      apiFetch<Product[]>("/products?featured=true&limit=8"),
      apiFetch<Campaign | null>("/campaigns/active").catch(() => null),
      apiFetch<InstagramPost[]>("/instagram").catch(() => []),
    ]);
    return { products, campaign, instagram };
  } catch {
    return { products: [], campaign: null, instagram: [] };
  }
}

const CATEGORIES: { type: ProductType; label: string; num: string }[] = [
  { type: "gift_box",     label: t.productTypes.gift_box,     num: "01" },
  { type: "curation_set", label: t.productTypes.curation_set, num: "02" },
  { type: "single",       label: t.productTypes.single,       num: "03" },
];

export default async function HomePage() {
  const { products, campaign, instagram } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <HeroCampaign campaign={campaign} />

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="section-label">{t.home.featuredSets}</p>
            <h2 className="mt-2 section-title">{t.home.bestSeller}</h2>
          </div>
          <Link href="/products" className="btn-ghost hidden md:inline-flex">
            {t.home.viewAll} →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-dami-400">{t.home.comingSoon}</p>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link href="/products" className="btn-secondary">
            {t.home.viewAll}
          </Link>
        </div>
      </section>

      {/* Category band — neutral, airy */}
      <section className="border-y border-dami-200 bg-dami-50 dark:border-dami-700 dark:bg-dami-800/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center divide-x divide-dami-200 dark:divide-dami-700 md:flex-nowrap">
          {CATEGORIES.map(({ type, label, num }) => (
            <Link
              key={type}
              href={`/products?type=${type}`}
              className="group flex flex-1 flex-col items-center gap-3 px-6 py-10 text-center transition-colors hover:bg-dami-100 dark:hover:bg-dami-800 md:py-14"
            >
              <span className="text-sm font-light tracking-widest text-dami-300 transition-colors group-hover:text-dami-500 dark:text-dami-600 dark:group-hover:text-dami-400">
                {num}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-dami-600 transition-colors group-hover:text-dami-900 dark:text-dami-300 dark:group-hover:text-white">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand narrative */}
      <section className="border-b border-dami-200 bg-[var(--surface-muted)] px-6 py-20 text-center dark:border-dami-700 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="section-label">{t.nav.story}</p>
          <h2 className="mt-4 text-sm font-normal leading-loose text-dami-600 dark:text-dami-300 md:text-base">
            {t.story.intro}
          </h2>
          <Link href="/story" className="btn-secondary mt-10 inline-flex">
            {t.story.exploreSets}
          </Link>
        </div>
      </section>

      {/* Instagram */}
      {instagram.length > 0 && (
        <section className="border-t border-dami-200 dark:border-dami-700">
          <div className="mx-auto max-w-7xl px-5">
            <InstagramGrid posts={instagram} />
          </div>
        </section>
      )}
    </>
  );
}
