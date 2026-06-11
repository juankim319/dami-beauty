import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import type { Product } from "@/types";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getMessages();
  try {
    const product = await apiFetch<Product>(`/products/${params.slug}`);
    return {
      title: product.name_tr,
      description: product.description_tr.slice(0, 160),
      openGraph: { images: product.images[0] ? [product.images[0]] : [] },
    };
  } catch {
    return { title: t.products.notFound };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  let product: Product;
  try {
    product = await apiFetch<Product>(`/products/${params.slug}`);
  } catch {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
