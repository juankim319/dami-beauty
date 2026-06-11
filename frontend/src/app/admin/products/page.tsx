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
import type { Product, ProductType } from "@/types";
import { getMessages } from "@/lib/i18n";

const CARD = "rounded-xl border border-white/5 bg-[#1a2332] p-5";
const INPUT = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-[#00e5ff]/50";
const LABEL = "block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1";

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
};

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "on_sale", label: "Satışta" },
  { key: "low_stock", label: "Az Stok" },
  { key: "out_of_stock", label: "Tükendi" },
  { key: "hidden", label: "Gizli" },
];

function productToForm(p: Product): ProductForm {
  return {
    name_tr: p.name_tr,
    slug: p.slug,
    type: p.type,
    description_tr: p.description_tr,
    base_price_try: p.base_price_try / 100,
    stock: getProductStock(p),
    low_stock_threshold: getProductThreshold(p),
    sale_status: getProductSaleStatus(p),
  };
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
    const statusPatch = buildProductUpdateFromStatus(
      existing ?? {
        id: "",
        name_tr: f.name_tr,
        slug: f.slug,
        type: f.type,
        description_tr: f.description_tr,
        images: [],
        base_price_try: priceKurus,
        variants: [{ sku: `${f.slug || "SKU"}-001`, options: {}, price_try: priceKurus, stock: f.stock, low_stock_threshold: f.low_stock_threshold }],
        is_featured: false,
        gift_wrap_available: true,
        active: true,
      },
      f.sale_status
    );

    const variant = statusPatch.variants[0] ?? {
      sku: `${f.slug || "SKU"}-001`,
      options: {},
      price_try: priceKurus,
      stock: f.stock,
      low_stock_threshold: f.low_stock_threshold,
    };

    variant.stock = f.stock;
    variant.low_stock_threshold = f.low_stock_threshold;
    variant.price_try = priceKurus;

    if (f.sale_status === "out_of_stock") variant.stock = 0;
    if (f.sale_status === "on_sale" && variant.stock <= 0) variant.stock = Math.max(f.stock, 1);

    return {
      name_tr: f.name_tr,
      slug: f.slug || f.name_tr.toLowerCase().replace(/\s+/g, "-"),
      type: f.type,
      description_tr: f.description_tr,
      base_price_try: priceKurus,
      active: f.sale_status === "hidden" ? false : true,
      variants: [variant],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const existing = editingId ? products.find((p) => p.id === editingId) : undefined;
      const payload = buildPayload(form, existing);

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
          className="rounded-lg bg-[#00e5ff]/10 px-4 py-2 text-[12px] font-semibold text-[#00e5ff] ring-1 ring-[#00e5ff]/25 hover:bg-[#00e5ff]/20"
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
                ? "bg-[#00e5ff]/15 text-[#00e5ff] ring-1 ring-[#00e5ff]/30"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
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
            <p className="text-sm font-semibold text-white">{editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</p>
            <button type="button" onClick={closeForm} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={LABEL}>Ürün Adı *</label><input className={INPUT} required value={form.name_tr} onChange={(e) => setForm({ ...form, name_tr: e.target.value })} /></div>
              <div><label className={LABEL}>URL Slug</label><input className={INPUT} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL}>Kategori</label>
                <select className={INPUT} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}>
                  {productTypes.map((type) => <option key={type} value={type}>{t.productTypes[type]}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Satış Durumu *</label>
                <select className={INPUT} value={form.sale_status} onChange={(e) => setForm({ ...form, sale_status: e.target.value as ProductSaleStatus })}>
                  {(Object.keys(PRODUCT_STATUS_LABEL) as ProductSaleStatus[]).map((s) => (
                    <option key={s} value={s}>{PRODUCT_STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div><label className={LABEL}>Açıklama</label><textarea className={`${INPUT} min-h-[80px]`} value={form.description_tr} onChange={(e) => setForm({ ...form, description_tr: e.target.value })} /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className={LABEL}>Fiyat (₺) *</label><input className={INPUT} type="number" step="0.01" required value={form.base_price_try || ""} onChange={(e) => setForm({ ...form, base_price_try: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className={LABEL}>Stok</label><input className={INPUT} type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></div>
              <div><label className={LABEL}>Az Stok Eşiği</label><input className={INPUT} type="number" min={0} value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: parseInt(e.target.value) || 0 })} /></div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-[#00e5ff]/10 py-2.5 text-sm font-semibold text-[#00e5ff] ring-1 ring-[#00e5ff]/30 hover:bg-[#00e5ff]/20 disabled:opacity-50">
                {saving ? "Kaydediliyor..." : editingId ? "Değişiklikleri Kaydet" : "Ürün Ekle"}
              </button>
              <button type="button" onClick={closeForm} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5">İptal</button>
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
            <div key={p.id} className="rounded-xl border border-white/5 bg-[#1a2332] px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                      {PRODUCT_STATUS_LABEL[status]}
                    </span>
                    <p className="font-semibold text-white">{p.name_tr}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    <span>{t.productTypes[p.type]}</span>
                    <span className="font-medium text-emerald-400">{formatTRY(p.base_price_try)}</span>
                    <span>Stok: {stock}</span>
                    <span>Az stok ≤{getProductThreshold(p)}</span>
                    <span className="font-mono opacity-50">{p.slug}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => openEdit(p)} className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-white/10">Düzenle</button>
                  <button type="button" onClick={() => handleDelete(p)} className="rounded-lg border border-red-500/20 px-3 py-1.5 text-[11px] text-red-400 hover:bg-red-900/20">Sil</button>
                </div>
              </div>

              {/* Quick status change */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Durum Değiştir</span>
                {(Object.keys(PRODUCT_STATUS_LABEL) as ProductSaleStatus[])
                  .filter((s) => s !== status)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => changeStatus(p, s)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${PRODUCT_STATUS_STYLE[s].bg} ${PRODUCT_STATUS_STYLE[s].text} hover:opacity-80`}
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
