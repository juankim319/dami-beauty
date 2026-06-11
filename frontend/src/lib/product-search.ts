import type { Product } from "@/types";

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getRecommendedProducts(products: Product[], limit = 5): Product[] {
  const featured = products.filter((p) => p.is_featured);
  const rest = products.filter((p) => !p.is_featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getPlaceholderNames(products: Product[], limit = 8): string[] {
  return getRecommendedProducts(products, limit).map((p) => p.name_tr);
}

export function matchProducts(products: Product[], query: string, limit = 6): Product[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const scored = products
    .map((p) => {
      const name = normalize(p.name_tr);
      const desc = normalize(p.description_tr || "");
      const slug = normalize(p.slug);
      let score = 0;
      if (name.startsWith(q)) score += 10;
      else if (name.includes(q)) score += 6;
      if (slug.includes(q)) score += 3;
      if (desc.includes(q)) score += 1;
      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ product }) => product);
}

export function getRelatedTerms(products: Product[], query: string, limit = 6): string[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const terms = new Map<string, number>();

  for (const p of products) {
    const name = p.name_tr;
    const nn = normalize(name);
    if (nn.includes(q)) {
      terms.set(name, (terms.get(name) ?? 0) + (nn.startsWith(q) ? 10 : 5));
    }

    for (const word of name.split(/\s+/)) {
      const nw = normalize(word);
      if (nw.length >= 2 && nw.startsWith(q) && nw !== q) {
        terms.set(word, (terms.get(word) ?? 0) + 4);
      }
    }
  }

  return Array.from(terms.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, limit);
}

export function filterProductsByQuery(products: Product[], query: string): Product[] {
  const q = normalize(query.trim());
  if (!q) return products;
  return products.filter((p) => {
    const hay = normalize(`${p.name_tr} ${p.description_tr} ${p.slug}`);
    return hay.includes(q);
  });
}
