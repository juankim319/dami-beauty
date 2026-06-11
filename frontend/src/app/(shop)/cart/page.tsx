"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatTRY } from "@/lib/format";
import { getMessages } from "@/lib/i18n";
import { CartCountdownBanner } from "@/components/shop/CartCountdownBanner";

const t = getMessages();
const FREE_SHIPPING = 99999; // ₺999,99
const SHIPPING_COST = 4900;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotalTry, itemCount } = useCart();

  const shipping = subtotalTry >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const total = subtotalTry + shipping;

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-2xl text-dami-300">—</p>
        <h1 className="mt-4 text-sm font-medium text-dami-800">{t.cart.empty}</h1>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          {t.cart.shopStart}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <CartCountdownBanner />

      {/* Header */}
      <div className="mb-10 border-b border-dami-200 pb-6">
        <p className="section-label">{t.brand.name}</p>
        <h1 className="mt-1 section-title">
          {t.cart.title(itemCount)}
        </h1>
      </div>

      {/* Items */}
      <div className="divide-y divide-dami-200">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantSku}`} className="flex gap-5 py-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-dami-100">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-dami-300">—</div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-dami-800">{item.name}</p>
              {Object.entries(item.options).map(([k, v]) => (
                <p key={k} className="text-xs text-dami-500">{k}: {v}</p>
              ))}
              <p className="text-sm text-dami-700">{formatTRY(item.unitPriceTry)}</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center border border-dami-200">
                  <button type="button" onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity - 1)} className="px-3 py-1 text-sm hover:bg-dami-100">−</button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, item.variantSku, item.quantity + 1)} className="px-3 py-1 text-sm hover:bg-dami-100">+</button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantSku)}
                  className="ml-auto text-xs text-dami-400 underline-offset-2 hover:underline"
                >
                  {t.cart.delete}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 border-t border-dami-200 pt-6 space-y-3 text-sm text-dami-700">
        <div className="flex justify-between">
          <span>{t.cart.subtotal}</span>
          <span>{formatTRY(subtotalTry)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.cart.shipping}</span>
          <span>{shipping === 0 ? t.cart.freeShipping : formatTRY(shipping)}</span>
        </div>
        {subtotalTry < FREE_SHIPPING && (
          <p className="text-xs text-dami-400">{t.cart.freeShippingHint(formatTRY(FREE_SHIPPING - subtotalTry))}</p>
        )}
        <div className="flex justify-between border-t border-dami-200 pt-3 text-base font-medium text-dami-900">
          <span>{t.cart.total}</span>
          <span>{formatTRY(total)}</span>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary mt-8 block w-full text-center">
        {t.cart.checkout}
      </Link>
    </div>
  );
}
