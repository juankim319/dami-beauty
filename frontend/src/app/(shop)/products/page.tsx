import { apiFetch } from "@/lib/api";
import { filterProductsByQuery } from "@/lib/product-search";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product, ProductType } from "@/types";
import Link from "next/link";
import { getMessages } from "@/lib/i18n";

export const revalidate = 60;

interface Props {
  searchParams: { type?: string; q?: string; featured?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const t = getMessages();
  const type = searchParams.type as ProductType | undefined;
  const searchQuery = searchParams.q?.trim() ?? "";
  const featured = searchParams.featured === "true" ? true : undefined;

  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (featured) params.set("featured", "true");
  const queryString = params.toString() ? `?${params.toString()}` : "";

  let products: Product[] = [];
  try {
    products = await apiFetch<Product[]>(`/products${queryString}`);
  } catch {
    products = [];
  }

  if (searchQuery) {
    products = filterProductsByQuery(products, searchQuery);
  }

  const filters: { value: ProductType | undefined; label: string }[] = [
    { value: undefined,       label: t.productTypes.all },
    { value: "gift_box",      label: t.productTypes.gift_box },
    { value: "curation_set",  label: t.productTypes.curation_set },
    { value: "single",        label: t.productTypes.single },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* Page header */}
      <div className="mb-10 border-b border-dami-200 pb-8">
        <p className="section-label">{t.brand.name}</p>
        <h1 className="mt-1 section-title">
          {searchQuery
            ? `"${searchQuery}" — ${t.search.results}`
            : featured
            ? t.home.bestSeller
            : t.products.title}
        </h1>
        {searchQuery && (
          <p className="mt-2 text-sm text-dami-500">
            {products.length} {products.length === 1 ? "ürün" : "ürün"}
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-10 flex items-center gap-1 overflow-x-auto pb-1">
        {filters.map(({ value, label }) => {
          const active = !featured && (type === value || (!type && !value));
          return (
            <Link
              key={value || "all"}
              href={value ? `/products?type=${value}` : "/products"}
              className={`whitespace-nowrap px-5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                active
                  ? "bg-dami-900 text-white dark:bg-white dark:text-dami-900"
                  : "border border-dami-200 text-dami-500 hover:border-dami-900 hover:text-dami-900 dark:border-dami-700 dark:text-dami-400 dark:hover:border-white dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
        {products.length > 0 && (
          <span className="ml-auto text-xs text-dami-400">{products.length}</span>
        )}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-sm text-dami-400">
            {searchQuery ? t.search.noResults : t.products.emptyCategory}
          </p>
        </div>
      )}
    </div>
  );
}
