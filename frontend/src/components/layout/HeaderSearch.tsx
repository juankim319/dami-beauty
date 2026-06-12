"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getMessages } from "@/lib/i18n";
import { formatTRY, productMinPrice } from "@/lib/format";
import {
  getPlaceholderNames,
  getRecommendedProducts,
  getRelatedTerms,
  matchProducts,
} from "@/lib/product-search";
import type { Product } from "@/types";

export function HeaderSearch() {
  const t = getMessages();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    apiFetch<Product[]>("/products?limit=100")
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const placeholders = useMemo(() => getPlaceholderNames(products), [products]);
  const recommended = useMemo(() => getRecommendedProducts(products, 5), [products]);
  const relatedTerms = useMemo(
    () => (query.trim() ? getRelatedTerms(products, query) : []),
    [products, query]
  );
  const matched = useMemo(
    () => (query.trim() ? matchProducts(products, query, 6) : recommended),
    [products, query, recommended]
  );

  const rotatingPlaceholder =
    placeholders.length > 0
      ? placeholders[placeholderIdx % placeholders.length]
      : t.search.placeholderDefault;

  useEffect(() => {
    if (placeholders.length < 2 || open || query) return;
    const id = window.setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [placeholders.length, open, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const goSearch = useCallback(
    (term: string) => {
      const q = term.trim();
      if (!q) return;
      setOpen(false);
      setQuery("");
      router.push(`/products?q=${encodeURIComponent(q)}`);
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goSearch(query);
  };

  const showDropdown = open;
  const hasQuery = query.trim().length > 0;

  const dropdown = showDropdown && (
    <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[min(calc(100vw-2.5rem),22rem)] overflow-hidden rounded-2xl border border-dami-200/80 bg-white/95 shadow-lg backdrop-blur-sm sm:w-80">
      {hasQuery && relatedTerms.length > 0 && (
        <div className="border-b border-dami-100 px-3 py-2">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400">
            {t.search.related}
          </p>
          <ul>
            {relatedTerms.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goSearch(term)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-dami-800 transition-colors hover:bg-dami-50"
                >
                  <svg className="h-3.5 w-3.5 shrink-0 text-dami-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="truncate">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-3 py-2">
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400">
          {hasQuery ? t.search.results : t.search.recommended}
        </p>
        {matched.length === 0 ? (
          <p className="px-2 py-4 text-center text-[12px] text-dami-400">{t.search.noResults}</p>
        ) : (
          <ul className="max-h-[280px] space-y-0.5 overflow-y-auto">
            {matched.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-dami-50"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-dami-100">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-dami-400">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-dami-800">{p.name_tr}</p>
                    <p className="text-[11px] text-dami-400">{formatTRY(productMinPrice(p))}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {hasQuery && matched.length > 0 && (
          <button
            type="button"
            onClick={() => goSearch(query)}
            className="mt-2 w-full rounded-lg border border-dami-200 py-2 text-[11px] font-medium text-dami-700 transition-colors hover:bg-dami-50"
          >
            {t.search.viewAll(query.trim())}
          </button>
        )}
      </div>
    </div>
  );

  const inputClasses =
    "w-full rounded-full border border-dami-200 bg-white/80 py-2 pl-9 pr-3 text-[12px] text-dami-800 placeholder:text-dami-400 outline-none transition-all focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/10";

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1 sm:max-w-xs md:max-w-sm lg:max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dami-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={open && !query ? t.search.placeholderActive : `"${rotatingPlaceholder}"`}
            className={inputClasses}
            aria-label={t.search.ariaLabel}
            aria-autocomplete="list"
            autoComplete="off"
          />
        </div>
      </form>
      {dropdown}
    </div>
  );
}
