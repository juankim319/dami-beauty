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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    if (!open && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
        inputRef.current?.blur();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, mobileOpen]);

  const goSearch = useCallback(
    (term: string) => {
      const q = term.trim();
      if (!q) return;
      setOpen(false);
      setMobileOpen(false);
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
    <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-xl border border-dami-200 bg-white shadow-xl dark:border-dami-800 dark:bg-[#141012] dark:shadow-2xl sm:w-80">
      {hasQuery && relatedTerms.length > 0 && (
        <div className="border-b border-dami-100 px-3 py-2 dark:border-dami-800">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400 dark:text-dami-300/70">
            {t.search.related}
          </p>
          <ul>
            {relatedTerms.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goSearch(term)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] text-dami-800 transition-colors hover:bg-dami-50 dark:text-dami-100 dark:hover:bg-white/5"
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
        <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400 dark:text-dami-300/70">
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
                    setMobileOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-dami-50 dark:hover:bg-white/5"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-dami-100 dark:bg-dami-800">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-dami-400">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-dami-800 dark:text-white">{p.name_tr}</p>
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
            className="mt-2 w-full rounded-lg border border-dami-200 py-2 text-[11px] font-medium text-dami-700 transition-colors hover:bg-dami-50 dark:border-dami-600/30 dark:text-dami-200 dark:hover:bg-white/5"
          >
            {t.search.viewAll(query.trim())}
          </button>
        )}
      </div>
    </div>
  );

  const inputClasses =
    "w-full rounded-full border border-dami-300 bg-dami-100/70 py-1.5 pl-9 pr-3 text-[12px] text-dami-800 placeholder:text-dami-400 outline-none transition-all focus:border-dami-700 focus:bg-white focus:ring-1 focus:ring-dami-200 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-dami-300/50 dark:focus:border-dami-300/40 dark:focus:bg-white/15 dark:focus:ring-dami-300/20";

  return (
    <>
      {/* Desktop / tablet inline search */}
      <div ref={rootRef} className="relative hidden sm:block">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dami-500 dark:text-dami-300/60"
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
              className={`${inputClasses} w-36 md:w-44 lg:w-52`}
              aria-label={t.search.ariaLabel}
              aria-autocomplete="list"
              autoComplete="off"
            />
          </div>
        </form>
        {dropdown}
      </div>

      {/* Mobile: icon → expand */}
      <div className="relative sm:hidden">
        {!mobileOpen ? (
          <button
            type="button"
            onClick={() => {
              setMobileOpen(true);
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="flex h-8 w-8 items-center justify-center text-dami-700 transition-colors hover:text-dami-900 dark:text-dami-300 dark:hover:text-white"
            aria-label={t.search.ariaLabel}
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        ) : (
          <div
            ref={rootRef}
            className="fixed inset-x-0 top-0 z-[70] border-b border-dami-200 bg-[#FDFAF9]/98 px-4 pb-3 pt-3 backdrop-blur-md dark:border-dami-800/50 dark:bg-dami-900/98"
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dami-500 dark:text-dami-300/60"
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
                  placeholder={query ? t.search.placeholderActive : `"${rotatingPlaceholder}"`}
                  className={`${inputClasses} w-full`}
                  aria-label={t.search.ariaLabel}
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setOpen(false);
                  setQuery("");
                }}
                className="shrink-0 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-dami-600 dark:text-dami-300"
              >
                {t.search.close}
              </button>
            </form>
            {open && (
              <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-dami-200 bg-white dark:border-dami-800 dark:bg-[#1a1216]">
                {hasQuery && relatedTerms.length > 0 && (
                  <div className="border-b border-dami-100 px-3 py-2 dark:border-dami-800">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400 dark:text-dami-300/70">
                      {t.search.related}
                    </p>
                    {relatedTerms.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => goSearch(term)}
                        className="block w-full truncate rounded-lg px-2 py-2 text-left text-[13px] text-dami-800 hover:bg-dami-50 dark:text-dami-100 dark:hover:bg-white/5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
                <div className="px-3 py-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-dami-400 dark:text-dami-300/70">
                    {hasQuery ? t.search.results : t.search.recommended}
                  </p>
                  {matched.length === 0 ? (
                    <p className="py-4 text-center text-[12px] text-dami-400">{t.search.noResults}</p>
                  ) : (
                    matched.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={() => {
                          setMobileOpen(false);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-dami-50 dark:hover:bg-white/5"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-dami-100 dark:bg-dami-800">
                          {p.images[0] && (
                            <Image src={p.images[0]} alt="" fill className="object-cover" sizes="40px" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-medium text-dami-800 dark:text-white">{p.name_tr}</p>
                          <p className="text-[11px] text-dami-400">{formatTRY(productMinPrice(p))}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
