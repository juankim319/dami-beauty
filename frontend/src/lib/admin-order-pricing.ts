import type { Order } from "@/types";

/** Hediye paketi ücreti (kuruş) — backend settings.gift_wrap_price_try ile aynı */
export const GIFT_WRAP_PRICE_TRY = 5000;

export function getOrderPriceBreakdown(order: Order) {
  const giftWrapTry = order.gift_wrap ? GIFT_WRAP_PRICE_TRY : 0;
  const shippingTry = Math.max(0, order.shipping_try - giftWrapTry);
  return {
    subtotalTry: order.subtotal_try,
    shippingTry,
    giftWrapTry,
    totalTry: order.total_try,
  };
}
