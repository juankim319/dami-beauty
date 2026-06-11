import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatTRY, productMinPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = productMinPrice(product);
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="product-img-wrap relative aspect-[3/4] overflow-hidden bg-dami-100 dark:bg-dami-900/50">
        {image ? (
          <Image
            src={image}
            alt={product.name_tr}
            fill
            className="object-cover"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-dami-100 to-dami-200">
            <span className="text-xs text-dami-300">—</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-dami-700 line-clamp-2 transition-colors group-hover:text-dami-900 dark:text-dami-200 dark:group-hover:text-white">
          {product.name_tr}
        </h3>
        <p className="text-xs text-dami-500 dark:text-dami-400">{formatTRY(price)}</p>
      </div>
    </Link>
  );
}
