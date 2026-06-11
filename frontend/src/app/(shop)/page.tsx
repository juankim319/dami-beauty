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

const CATEGORIES: { type: ProductType; label: string }[] = [
  { type: "gift_box",     label: t.productTypes.gift_box     },
  { type: "curation_set", label: t.productTypes.curation_set },
  { type: "single",       label: t.productTypes.single       },
];

export default async function HomePage() {
  const { products, campaign, instagram } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <HeroCampaign campaign={campaign} />

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="section-label">{t.home.featuredSets}</p>
            <h2 className="mt-1 section-title">
              {t.home.bestSeller}
            </h2>
          </div>
          <Link href="/products" className="btn-ghost hidden md:inline-flex">
            {t.home.viewAll} →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-dami-500">{t.home.comingSoon}</p>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="btn-secondary">
            {t.home.viewAll}
          </Link>
        </div>
      </section>

      {/* Category band */}
      <section className="border-y border-dami-800 bg-dami-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-0 divide-x divide-dami-700 md:flex-nowrap">
          {CATEGORIES.map(({ type, label }) => (
            <Link
              key={type}
              href={`/products?type=${type}`}
              className="group flex flex-1 flex-col items-center gap-3 px-6 py-10 text-center transition-colors hover:bg-dami-800 md:py-14"
            >
              <span className="text-lg font-light text-dami-400 transition-colors group-hover:text-dami-200">
                {type === "gift_box" ? "01" : type === "curation_set" ? "02" : "03"}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-dami-100/75 group-hover:text-white">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand narrative */}
      <section className="mx-auto max-w-3xl bg-dami-50 px-6 py-20 text-center dark:bg-[var(--surface-muted)] md:py-28">
        <p className="section-label">{t.nav.story}</p>
        <h2 className="mt-3 text-sm font-normal leading-relaxed text-dami-700 dark:text-dami-200 md:text-base">
          {t.story.intro}
        </h2>
        <Link href="/story" className="btn-secondary mt-10 inline-flex">
          {t.story.exploreSets}
        </Link>
      </section>

      {/* Instagram */}
      {instagram.length > 0 && (
        <section className="border-t border-dami-200 dark:border-dami-800">
          <div className="mx-auto max-w-7xl px-5">
            <InstagramGrid posts={instagram} />
          </div>
        </section>
      )}
    </>
  );
}
