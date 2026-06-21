"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_STYLE,
  type ProductSaleStatus,
  buildProductUpdateFromStatus,
  getProductSaleStatus,
  getProductStock,
  getProductThreshold,
} from "@/lib/admin-product-status";
import { ADMIN_INPUT, ADMIN_OPTION, ADMIN_SELECT, ADMIN_LABEL, ADMIN_CARD, ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY, ADMIN_BTN_DANGER, ADMIN_BTN_ICON, ADMIN_BADGE, ADMIN_PILL, ADMIN_FILTER_ACTIVE, ADMIN_FILTER_IDLE } from "@/lib/admin-form-styles";
import type { Product, ProductType } from "@/types";
import { getMessages } from "@/lib/i18n";

const CARD = ADMIN_CARD;
const INPUT = ADMIN_INPUT;
const SELECT = ADMIN_SELECT;
const LABEL = ADMIN_LABEL;

type StatusFilter = "all" | ProductSaleStatus;
type ProductForm = {
  name_tr: string;
  slug: string;
  type: ProductType;
  description_tr: string;
  base_price_try: number;
  stock: number;
  low_stock_threshold: number;
  sale_status: ProductSaleStatus;
  stockInput: string;
  thresholdInput: string;
  priceInput: string;
  tags: string[];
  tagInput: string;
};

const EMPTY_FORM: ProductForm = {
  name_tr: "",
  slug: "",
  type: "gift_box",
  description_tr: "",
  base_price_try: 0,
  stock: 10,
  low_stock_threshold: 5,
  sale_status: "on_sale",
  stockInput: "10",
  thresholdInput: "5",
  priceInput: "",
  tags: [],
  tagInput: "",
};

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "on_sale", label: "Satışta" },
  { key: "low_stock", label: "Az Stok" },
  { key: "out_of_stock", label: "Tükendi" },
  { key: "hidden", label: "Gizli" },
];

function productToForm(p: Product): ProductForm {
  const stock = getProductStock(p);
  const threshold = getProductThreshold(p);
  const price = p.base_price_try / 100;
  return {
    name_tr: p.name_tr,
    slug: p.slug,
    type: p.type,
    description_tr: p.description_tr,
    base_price_try: price,
    stock,
    low_stock_threshold: threshold,
    sale_status: getProductSaleStatus(p),
    stockInput: String(stock),
    thresholdInput: String(threshold),
    priceInput: price > 0 ? String(price) : "",
    tags: p.tags ?? [],
    tagInput: "",
  };
}

function parseNonNegativeInt(raw: string, fallback = 0) {
  const trimmed = raw.trim();
  if (trimmed === "") return fallback;
  const n = Number.parseInt(trimmed, 10);
  if (Number.isNaN(n) || n < 0) return fallback;
  return n;
}

function saleStatusFromStock(stock: number, threshold: number): ProductSaleStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= threshold) return "low_stock";
  return "on_sale";
}

export default function AdminProductsPage() {
  const t = getMessages();
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const productTypes = ["single", "gift_box", "curation_set"] as ProductType[];

  const load = () => {
    if (!token) return;
    apiFetch<Product[]>("/admin/products", { token }).then(setProducts).catch(console.error);
  };

  useEffect(load, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("filter") as StatusFilter | null;
    if (q && STATUS_FILTERS.some((f) => f.key === q)) setFilter(q);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => getProductSaleStatus(p) === filter);
  }, [products, filter]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = {
      all: products.length,
      on_sale: 0,
      low_stock: 0,
      out_of_stock: 0,
      hidden: 0,
    };
    products.forEach((p) => {
      c[getProductSaleStatus(p)] += 1;
    });
    return c;
  }, [products]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(productToForm(p));
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const buildPayload = (f: ProductForm, existing?: Product) => {
    const priceKurus = Math.round(f.base_price_try * 100);
    const stock = f.stock;
    const threshold = f.low_stock_threshold;

    let saleStatus = f.sale_status;
    if (saleStatus !== "hidden") {
      if (stock <= 0) {
        saleStatus = "out_of_stock";
      } else if (saleStatus === "out_of_stock") {
        saleStatus = saleStatusFromStock(stock, threshold);
      }
    }

    const statusPatch = buildProductUpdateFromStatus(
      existing ?? {
        id: "",
        name_tr: f.name_tr,
        slug: f.slug,
        type: f.type,
        description_tr: f.description_tr,
        images: [],
        base_price_try: priceKurus,
        variants: [{ sku: `${f.slug || "SKU"}-001`, options: {}, price_try: priceKurus, stock, low_stock_threshold: threshold }],
        is_featured: false,
        gift_wrap_available: true,
        active: true,
      },
      saleStatus
    );

    const variant = statusPatch.variants[0] ?? {
      sku: `${f.slug || "SKU"}-001`,
      options: {},
      price_try: priceKurus,
      stock,
      low_stock_threshold: threshold,
    };

    variant.stock = saleStatus === "out_of_stock" ? 0 : stock;
    variant.low_stock_threshold = threshold;
    variant.price_try = priceKurus;

    return {
      name_tr: f.name_tr,
      slug: f.slug || f.name_tr.toLowerCase().replace(/\s+/g, "-"),
      type: f.type,
      description_tr: f.description_tr,
      base_price_try: priceKurus,
      active: saleStatus === "hidden" ? false : true,
      variants: [variant],
      tags: f.tags,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const normalizedForm: ProductForm = {
        ...form,
        stock: parseNonNegativeInt(form.stockInput, form.stock),
        low_stock_threshold: parseNonNegativeInt(form.thresholdInput, form.low_stock_threshold),
        base_price_try: form.priceInput === "" ? form.base_price_try : Number.parseFloat(form.priceInput) || form.base_price_try,
        sale_status:
          form.sale_status === "hidden"
            ? "hidden"
            : saleStatusFromStock(
                parseNonNegativeInt(form.stockInput, form.stock),
                parseNonNegativeInt(form.thresholdInput, form.low_stock_threshold)
              ),
      };

      const existing = editingId ? products.find((p) => p.id === editingId) : undefined;
      const payload = buildPayload(normalizedForm, existing);

      if (editingId) {
        await apiFetch(`/products/id/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/products", {
          method: "POST",
          token,
          body: JSON.stringify({
            ...payload,
            images: [],
            is_featured: false,
            gift_wrap_available: true,
          }),
        });
      }
      closeForm();
      load();
    } catch {
      setError("Kaydetme başarısız. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (product: Product, status: ProductSaleStatus) => {
    if (!token) return;
    const patch = buildProductUpdateFromStatus(product, status);
    await apiFetch(`/products/id/${product.id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(patch),
    });
    load();
  };

  const handleDelete = async (product: Product) => {
    if (!token) return;
    if (!confirm(`"${product.name_tr}" ürününü silmek istiyor musunuz?`)) return;
    await apiFetch(`/products/id/${product.id}`, { method: "DELETE", token });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">{products.length} ürün · {filtered.length} gösteriliyor</p>
        <button
          type="button"
          onClick={openCreate}
          className={`${ADMIN_BTN_PRIMARY} text-[12px]`}
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
              filter === key
                ? ADMIN_FILTER_ACTIVE
                : ADMIN_FILTER_IDLE
            }`}
          >
            {label}
            <span className="ml-1 opacity-60">({counts[key]})</span>
          </button>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className={CARD}>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">{editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</p>
            <button type="button" onClick={closeForm} className={ADMIN_BTN_ICON} aria-label="Kapat">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={LABEL}>Ürün Adı *</label><input className={INPUT} required value={form.name_tr} onChange={(e) => setForm({ ...form, name_tr: e.target.value })} /></div>
              <div><label className={LABEL}>URL Slug</label><input className={INPUT} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>Kategori</label>
                <select className={SELECT} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}>
                  {productTypes.map((type) => (
                    <option key={type} value={type} className={ADMIN_OPTION}>{t.productTypes[type]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Satış Durumu *</label>
                <select
                  className={SELECT}
                  value={form.sale_status}
                  onChange={(e) => {
                    const sale_status = e.target.value as ProductSaleStatus;
                    if (sale_status === "out_of_stock") {
                      setForm({
                        ...form,
                        sale_status,
                        stock: 0,
                        stockInput: "0",
                      });
                      return;
                    }
                    if (sale_status === "hidden") {
                      setForm({ ...form, sale_status });
                      return;
                    }
                    const stock = form.stock > 0 ? form.stock : 1;
                    setForm({
                      ...form,
                      sale_status,
                      stock,
                      stockInput: String(stock),
                    });
                  }}
                >
                  {(Object.keys(PRODUCT_STATUS_LABEL) as ProductSaleStatus[]).map((s) => (
                    <option key={s} value={s} className={ADMIN_OPTION}>{PRODUCT_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div><label className={LABEL}>Açıklama</label><textarea className={`${INPUT} min-h-[80px]`} value={form.description_tr} onChange={(e) => setForm({ ...form, description_tr: e.target.value })} /></div>

            {/* Hashtags */}
            <div>
              <label className={LABEL}>Etiketler (Hashtag)</label>
              <div className="flex gap-2">
                <input
                  className={INPUT}
                  placeholder="etiket ekle, Enter'a bas"
                  value={form.tagInput}
                  onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const tag = form.tagInput.trim().toLowerCase().replace(/^#+/, "").replace(/\s+/g, "_");
                      if (tag && !form.tags.includes(tag)) {
                        setForm({ ...form, tags: [...form.tags, tag], tagInput: "" });
                      } else {
                        setForm({ ...form, tagInput: "" });
                      }
                    }
                  }}
                />
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 rounded-full bg-[#9e4a5a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#9e4a5a]">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}
                        className="ml-0.5 text-[#9e4a5a]/60 hover:text-[#9e4a5a]"
                        aria-label={`${tag} kaldır`}
                      >✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={LABEL}>Fiyat (₺) *</label>
                <input
                  className={INPUT}
                  type="text"
                  inputMode="decimal"
                  required
                  value={form.priceInput}
                  onChange={(e) => {
                    const raw = e.target.value.replace(",", ".");
                    if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
                    setForm({
                      ...form,
                      priceInput: raw,
                      base_price_try: raw === "" ? 0 : Number.parseFloat(raw) || 0,
                    });
                  }}
                  onBlur={() => {
                    setForm((prev) => ({
                      ...prev,
                      priceInput: prev.base_price_try > 0 ? String(prev.base_price_try) : "",
                    }));
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Stok</label>
                <input
                  className={INPUT}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.stockInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw !== "" && !/^\d+$/.test(raw)) return;
                    const stock = raw === "" ? 0 : parseNonNegativeInt(raw, 0);
                    const sale_status =
                      form.sale_status === "hidden"
                        ? form.sale_status
                        : saleStatusFromStock(stock, form.low_stock_threshold);
                    setForm({
                      ...form,
                      stockInput: raw,
                      stock,
                      sale_status,
                    });
                  }}
                  onBlur={() => {
                    setForm((prev) => {
                      const stock = parseNonNegativeInt(prev.stockInput, 0);
                      const sale_status =
                        prev.sale_status === "hidden"
                          ? prev.sale_status
                          : saleStatusFromStock(stock, prev.low_stock_threshold);
                      return {
                        ...prev,
                        stock,
                        stockInput: String(stock),
                        sale_status,
                      };
                    });
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Az Stok Eşiği</label>
                <input
                  className={INPUT}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.thresholdInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw !== "" && !/^\d+$/.test(raw)) return;
                    const low_stock_threshold = raw === "" ? 0 : parseNonNegativeInt(raw, 0);
                    const sale_status =
                      form.sale_status === "hidden"
                        ? form.sale_status
                        : saleStatusFromStock(form.stock, low_stock_threshold);
                    setForm({
                      ...form,
                      thresholdInput: raw,
                      low_stock_threshold,
                      sale_status,
                    });
                  }}
                  onBlur={() => {
                    setForm((prev) => {
                      const low_stock_threshold = parseNonNegativeInt(prev.thresholdInput, 0);
                      const sale_status =
                        prev.sale_status === "hidden"
                          ? prev.sale_status
                          : saleStatusFromStock(prev.stock, low_stock_threshold);
                      return {
                        ...prev,
                        low_stock_threshold,
                        thresholdInput: String(low_stock_threshold),
                        sale_status,
                      };
                    });
                  }}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={`flex-1 ${ADMIN_BTN_PRIMARY} py-2.5 disabled:opacity-50`}>
                {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Ürün Ekle"}
              </button>
              <button type="button" onClick={closeForm} className={`${ADMIN_BTN_SECONDARY} py-2.5`}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">Bu durumda ürün bulunamadı.</div>
        )}
        {filtered.map((p) => {
          const status = getProductSaleStatus(p);
          const sc = PRODUCT_STATUS_STYLE[status];
          const stock = getProductStock(p);
          return (
            <div key={p.id} className="rounded-xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${ADMIN_BADGE} ${sc.bg} ${sc.text}`}>
                      {PRODUCT_STATUS_LABEL[status]}
                    </span>
                    <p className="font-semibold text-slate-800">{p.name_tr}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span>{t.productTypes[p.type]}</span>
                    <span className="font-medium text-emerald-700">{formatTRY(p.base_price_try)}</span>
                    <span>Stok: {stock}</span>
                    <span>Az stok ≤{getProductThreshold(p)}</span>
                    <span className="font-mono opacity-50">{p.slug}</span>
                  </div>
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#9e4a5a]/10 px-2 py-0.5 text-[10px] font-medium text-[#9e4a5a]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => openEdit(p)} className={ADMIN_BTN_SECONDARY}>Düzenle</button>
                  <button type="button" onClick={() => handleDelete(p)} className={ADMIN_BTN_DANGER}>Sil</button>
                </div>
              </div>

              {/* Quick status change */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Durum Değiştir</span>
                {(Object.keys(PRODUCT_STATUS_LABEL) as ProductSaleStatus[])
                  .filter((s) => s !== status)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => changeStatus(p, s)}
                      className={`${ADMIN_PILL} ${PRODUCT_STATUS_STYLE[s].bg} ${PRODUCT_STATUS_STYLE[s].text}`}
                    >
                      → {PRODUCT_STATUS_LABEL[s]}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
