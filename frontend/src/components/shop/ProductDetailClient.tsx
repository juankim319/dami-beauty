"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types";
import { formatTRY } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
import { getMessages } from "@/lib/i18n";
import { ScarcityAlerts } from "@/components/shop/ScarcityAlerts";
import { ProductImageCarousel } from "@/components/shop/ProductImageCarousel";

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const t = getMessages();
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      sku: "default",
      options: {},
      price_try: product.base_price_try,
      stock: 0,
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [added, setAdded] = useState(false);

  const optionKeys = Array.from(
    new Set(product.variants.flatMap((v) => Object.keys(v.options)))
  );

  const selectOption = (key: string, value: string) => {
    const match = product.variants.find((v) => v.options[key] === value);
    if (match) setSelectedVariant(match);
  };

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name_tr,
      variantSku: selectedVariant.sku,
      options: selectedVariant.options,
      unitPriceTry: selectedVariant.price_try,
      quantity,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const outOfStock = selectedVariant.stock <= 0;
  const lineTotal = selectedVariant.price_try * quantity;
  const images = product.images.filter(Boolean);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-10 pb-28 md:py-16 md:pb-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-dami-400 dark:text-dami-500">
          <Link href="/products" className="hover:text-dami-700 dark:hover:text-dami-300">{t.products.title}</Link>
          <span>/</span>
          <span className="text-dami-700 dark:text-dami-200">{product.name_tr}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_480px] lg:gap-16">
          <ProductImageCarousel images={images} alt={product.name_tr} />

          <div>
            <p className="section-label">{t.productTypes[product.type] ?? product.type}</p>
            <h1 className="mt-1 text-base font-medium text-dami-900 dark:text-dami-50 md:text-lg">
              {product.name_tr}
            </h1>
            <p className="mt-2 text-sm text-dami-700 dark:text-dami-300">{formatTRY(selectedVariant.price_try)}</p>

            {optionKeys.map((key) => {
              const values = Array.from(
                new Set(product.variants.map((v) => v.options[key]).filter(Boolean))
              );
              return (
                <div key={key} className="mt-8">
                  <label className="section-label">{key}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {values.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => selectOption(key, val!)}
                        className={`px-5 py-2 text-xs font-medium uppercase tracking-wide transition ${
                          selectedVariant.options[key] === val
                            ? "bg-dami-900 text-white"
                            : "border border-dami-200 text-dami-700 hover:border-dami-700 dark:border-dami-700 dark:text-dami-200 dark:hover:border-dami-400"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {product.gift_wrap_available && (
              <label className="mt-6 flex cursor-pointer items-center gap-3 border border-dami-200 px-4 py-3 hover:border-dami-400 dark:border-dami-700 dark:hover:border-dami-500">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="h-4 w-4 accent-dami-900"
                />
                <span className="text-xs font-medium uppercase tracking-wider text-dami-700 dark:text-dami-300">
                  {t.products.giftWrap}
                </span>
              </label>
            )}

            <ScarcityAlerts
              productId={product.id}
              stock={selectedVariant.stock}
              lowStockThreshold={selectedVariant.low_stock_threshold}
            />

            {!outOfStock && (
              <p className="mt-2 text-[10px] text-dami-400">
                {t.products.inStock(selectedVariant.stock)}
              </p>
            )}
            {outOfStock && (
              <p className="mt-4 text-xs text-dami-500">{t.products.outOfStock}</p>
            )}

            <div className="mt-6 hidden items-stretch gap-3 md:flex">
              <div className="flex items-center border border-dami-200 dark:border-dami-700">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-dami-700 transition hover:bg-dami-100 dark:text-dami-300 dark:hover:bg-dami-900/50">−</button>
                <span className="w-10 text-center text-sm font-medium dark:text-dami-100">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))} className="px-4 py-3 text-dami-700 transition hover:bg-dami-100 dark:text-dami-300 dark:hover:bg-dami-900/50">+</button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock}
                className="btn-primary flex-1"
              >
                {added ? t.products.added : t.products.addToCart}
              </button>
            </div>

            <div className="mt-10 border-t border-dami-200 pt-8 dark:border-dami-800">
              <p className="text-sm leading-relaxed text-dami-600 dark:text-dami-300">{product.description_tr}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/products?tag=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-[#9e4a5a]/10 px-3 py-1 text-[10px] font-medium text-[#9e4a5a] transition-colors hover:bg-[#9e4a5a]/20"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky add-to-cart */}
      {!outOfStock && (
        <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-dami-200/80 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(42,18,25,0.08)] backdrop-blur-md dark:border-dami-800/80 dark:bg-[#141012]/95 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <button
            type="button"
            onClick={handleAdd}
            className="btn-primary w-full py-3.5 text-xs tracking-wide"
          >
            {added ? t.products.added : t.pwa.addToCartSticky(formatTRY(lineTotal))}
          </button>
        </div>
      )}
    </>
  );
}
