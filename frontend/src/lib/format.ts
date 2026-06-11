/** Format kuruş to Turkish Lira display: 129900 → ₺1.299,00 */
export function formatTRY(kurus: number): string {
  const lira = kurus / 100;
  return (
    "₺" +
    lira
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

export function productMinPrice(product: { base_price_try: number; variants: { price_try: number }[] }): number {
  if (product.variants.length === 0) return product.base_price_try;
  return Math.min(...product.variants.map((v) => v.price_try));
}
