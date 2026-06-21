import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatTRY, productMinPrice } from "@/lib/format";
import { getMessages } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = getMessages();
  const price = productMinPrice(product);
  const image = product.images[0];
  const isNew = !product.is_featured;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="product-img-wrap relative aspect-[3/4] overflow-hidden bg-dami-100 dark:bg-[#3A1F1D]">
        {image ? (
          <Image
            src={image}
            alt={product.name_tr}
            fill
            className="object-cover"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-dami-100 to-dami-200 dark:from-[#3A1F1D] dark:to-[#4A2422]">
            <span className="text-xs tracking-widest text-dami-300 dark:text-dami-600">—</span>
          </div>
        )}

        {/* Subtle hover veil + quick view hint */}
        <div className="pointer-events-none absolute inset-0 bg-dami-900/0 transition-colors duration-500 group-hover:bg-dami-900/[0.04]" />
        <span className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 translate-y-2 text-[9px] font-medium uppercase tracking-[0.3em] text-dami-800 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          View
        </span>

        {isNew && (
          <span className="absolute left-2.5 top-2.5 bg-dami-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white dark:bg-white dark:text-dami-900">
            {t.products.newBadge}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-dami-700 line-clamp-2 transition-colors duration-200 group-hover:text-dami-900 dark:text-dami-300 dark:group-hover:text-white">
          {product.name_tr}
        </p>
        <p className="text-[12px] text-dami-400 transition-colors duration-200 group-hover:text-dami-600 dark:text-dami-500">
          {formatTRY(price)}
        </p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5" onClick={(e) => e.preventDefault()}>
            {product.tags.map((tag) => (
              <a
                key={tag}
                href={`/products?tag=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-[#9e4a5a]/10 px-2 py-0.5 text-[9px] font-medium text-[#9e4a5a] hover:bg-[#9e4a5a]/20 transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
