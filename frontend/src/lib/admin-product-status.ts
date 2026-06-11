import type { Product } from "@/types";

export type ProductSaleStatus = "on_sale" | "low_stock" | "out_of_stock" | "hidden";

export const PRODUCT_STATUS_LABEL: Record<ProductSaleStatus, string> = {
  on_sale: "Satışta",
  low_stock: "Az Stok",
  out_of_stock: "Tükendi",
  hidden: "Gizli",
};

export const PRODUCT_STATUS_STYLE: Record<ProductSaleStatus, { bg: string; text: string }> = {
  on_sale: { bg: "bg-emerald-900/40", text: "text-emerald-400" },
  low_stock: { bg: "bg-amber-900/40", text: "text-amber-400" },
  out_of_stock: { bg: "bg-red-900/40", text: "text-red-400" },
  hidden: { bg: "bg-slate-700/40", text: "text-slate-400" },
};

export function getProductStock(product: Product) {
  return product.variants[0]?.stock ?? 0;
}

export function getProductThreshold(product: Product) {
  return product.variants[0]?.low_stock_threshold ?? 5;
}

export function getProductSaleStatus(product: Product): ProductSaleStatus {
  if (!product.active) return "hidden";
  const stock = getProductStock(product);
  if (stock <= 0) return "out_of_stock";
  if (stock <= getProductThreshold(product)) return "low_stock";
  return "on_sale";
}

export function buildProductUpdateFromStatus(
  product: Product,
  status: ProductSaleStatus
): { active: boolean; variants: Product["variants"] } {
  const variant = product.variants[0];
  const variants = variant ? [{ ...variant }] : [];

  switch (status) {
    case "hidden":
      return { active: false, variants };
    case "out_of_stock":
      if (variants[0]) variants[0].stock = 0;
      return { active: true, variants };
    case "low_stock":
      if (variants[0] && variants[0].stock > getProductThreshold(product)) {
        variants[0].stock = getProductThreshold(product);
      }
      return { active: true, variants };
    case "on_sale":
    default:
      if (variants[0] && variants[0].stock <= 0) variants[0].stock = 1;
      return { active: true, variants };
  }
}
