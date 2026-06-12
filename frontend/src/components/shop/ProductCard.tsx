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
      {/* Image — hince: portrait ratio, no border */}
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
        {/* NEW badge — top-left, like hince "N" tag */}
        {isNew && (
          <span className="absolute left-2.5 top-2.5 bg-dami-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white dark:bg-white dark:text-dami-900">
            {t.products.newBadge}
          </span>
        )}
      </div>

      {/* Info — minimal, like hince */}
      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-dami-700 line-clamp-2 transition-colors group-hover:text-dami-900 dark:text-dami-300 dark:group-hover:text-white">
          {product.name_tr}
        </p>
        <p className="text-[12px] text-dami-400 dark:text-dami-500">{formatTRY(price)}</p>
      </div>
    </Link>
  );
}
