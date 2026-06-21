"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  formatAdminDate,
  isPendingOrder,
  isTodayOrder,
} from "@/lib/admin-order-utils";
import type { Order, Product, ShippingAddress } from "@/types";
import { CopyAddressButton } from "@/components/admin/CopyAddressButton";
import { exportSalesExcel, exportShippingExcel } from "@/lib/admin-export";
import { getOrderPriceBreakdown } from "@/lib/admin-order-pricing";

import { ADMIN_INPUT, ADMIN_OPTION, ADMIN_SELECT, ADMIN_CARD_COMPACT, ADMIN_FILTER_ACTIVE, ADMIN_FILTER_IDLE, ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY, ADMIN_BTN_ACCENT, ADMIN_BTN_SUCCESS, ADMIN_BTN_SUCCESS_OUTLINE, ADMIN_BTN_DANGER, ADMIN_BADGE, ADMIN_TOOLBAR, ADMIN_TOOLBAR_INSET } from "@/lib/admin-form-styles";

const CARD = ADMIN_CARD_COMPACT;
const INPUT = ADMIN_INPUT;
const SELECT = ADMIN_SELECT;
const LABEL = "mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500";

type OrderFilter = "all" | "today" | "pending" | (typeof ORDER_STATUSES)[number];

type OrderEditForm = {
  status: string;
  guest_email: string;
  guest_phone: string;
  customer_notes: string;
  tracking_number: string;
  notes: string;
  shipping_address: ShippingAddress;
};

function orderToForm(order: Order): OrderEditForm {
  return {
    status: order.status,
    guest_email: order.guest_email,
    guest_phone: order.guest_phone,
    customer_notes: order.customer_notes ?? "",
    tracking_number: order.tracking_number ?? "",
    notes: order.notes ?? "",
    shipping_address: { ...order.shipping_address },
  };
}

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OrderEditForm | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const now = new Date();
  const [exportYear, setExportYear] = useState(now.getFullYear());
  const [exportMonth, setExportMonth] = useState(now.getMonth() + 1);

  const load = () => {
    if (!token) return;
    apiFetch<Order[]>("/orders", { token }).then(setOrders).catch(console.error);
    apiFetch<Product[]>("/products", { token }).then(setProducts).catch(console.error);
  };

  useEffect(load, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("filter");
    if (q === "today" || q === "pending" || q === "all") setFilter(q);
    else if (q && ORDER_STATUSES.includes(q as (typeof ORDER_STATUSES)[number])) {
      setFilter(q as (typeof ORDER_STATUSES)[number]);
    }
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "today") return orders.filter(isTodayOrder);
    if (filter === "pending") return orders.filter(isPendingOrder);
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: orders.length,
      today: orders.filter(isTodayOrder).length,
      pending: orders.filter(isPendingOrder).length,
    };
    ORDER_STATUSES.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length; });
    return c;
  }, [orders]);

  const toggle = (id: string) => {
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditForm(orderToForm(order));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveOrder = async (orderId: string) => {
    if (!token || !editForm) return;
    setSavingId(orderId);
    try {
      await apiFetch(`/orders/${orderId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          status: editForm.status,
          guest_email: editForm.guest_email,
          guest_phone: editForm.guest_phone,
          customer_notes: editForm.customer_notes || null,
          tracking_number: editForm.tracking_number || null,
          notes: editForm.notes || null,
          shipping_address: editForm.shipping_address,
        }),
      });
      cancelEdit();
      load();
    } finally {
      setSavingId(null);
    }
  };

  const deleteOrder = async (order: Order) => {
    if (!token) return;
    const label = `#${order.id.slice(0, 8).toUpperCase()}`;
    const paidNote = ["paid", "processing", "shipped", "delivered"].includes(order.status)
      ? "\n\nÖdenmiş sipariş — stok geri yüklenir."
      : "";
    if (!confirm(`${label} siparişini kalıcı olarak silmek istiyor musunuz?\n\nBu işlem geri alınamaz.${paidNote}`)) return;

    setDeletingId(order.id);
    try {
      await apiFetch(`/orders/${order.id}`, { method: "DELETE", token });
      if (editingId === order.id) cancelEdit();
      setExpanded((p) => { const n = new Set(p); n.delete(order.id); return n; });
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const filterButtons: { key: OrderFilter; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "today", label: "Bugün" },
    { key: "pending", label: "Bekleyen" },
    ...ORDER_STATUSES.map((s) => ({ key: s as OrderFilter, label: ORDER_STATUS_LABEL[s] })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">{orders.length} sipariş · {filtered.length} gösteriliyor</p>
        <div className={ADMIN_TOOLBAR}>
          <div className={ADMIN_TOOLBAR_INSET}>
            <span className="text-[10px] font-medium text-slate-500">Satış Ayı</span>
            <select
              className={`${SELECT} !w-auto !border-0 !bg-transparent !py-0 text-[12px]`}
              value={exportYear}
              onChange={(e) => setExportYear(Number(e.target.value))}
            >
              {[now.getFullYear(), now.getFullYear() - 1].map((y) => (
                <option key={y} value={y} className={ADMIN_OPTION}>{y}</option>
              ))}
            </select>
            <select
              className={`${SELECT} !w-auto !border-0 !bg-transparent !py-0 text-[12px]`}
              value={exportMonth}
              onChange={(e) => setExportMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m} className={ADMIN_OPTION}>{m}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => exportSalesExcel(orders, exportYear, exportMonth)}
            className={ADMIN_BTN_SUCCESS_OUTLINE}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Satış Excel
          </button>
          <button
            type="button"
            onClick={() => exportShippingExcel(filtered)}
            className={ADMIN_BTN_PRIMARY}
            title="Mevcut filtreden ödendi/hazırlanıyor/kargoda siparişleri dışa aktarır"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Kargo Excel
          </button>
          <button type="button" onClick={load} className={ADMIN_BTN_SECONDARY}>
            ↻ Yenile
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label }) => (
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
            <span className="ml-1 opacity-60">({counts[key] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">Sipariş bulunamadı.</div>
        )}
        {filtered.map((order) => {
          const isOpen = expanded.has(order.id);
          const isEditing = editingId === order.id;
          const sc = ORDER_STATUS_STYLE[order.status] ?? { bg: "bg-slate-50 border-slate-200", text: "text-slate-600" };
          const addr = order.shipping_address;
          const pricing = getOrderPriceBreakdown(order);

          return (
            <div key={order.id} className={CARD}>
              <button type="button" onClick={() => toggle(order.id)} className="w-full px-5 py-4 text-left hover:bg-slate-50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`${ADMIN_BADGE} ${sc.bg} ${sc.text}`}>
                      {ORDER_STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[11px] text-slate-500">{formatAdminDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-700">{formatTRY(pricing.totalTry)}</p>
                      {order.gift_wrap && (
                        <p className="text-[10px] text-[#9e4a5a]">
                          ürün {formatTRY(pricing.subtotalTry)} + paket {formatTRY(pricing.giftWrapTry)}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">{order.items.reduce((s, i) => s + i.quantity, 0)} ürün</p>
                    </div>
                    <CopyAddressButton order={order} iconOnly label="Adres Kopyala" />
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">{addr.full_name}</span>
                  <span>{order.guest_email}</span>
                  <span>{order.guest_phone}</span>
                  <CopyAddressButton order={order} label="Adres Kopyala" className="sm:hidden" />
                </div>
              </button>

              {isOpen && (
                <div className="space-y-5 border-t border-black/[0.06] px-5 pb-5 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-slate-800">Sipariş Detayı</p>
                    <div className="flex flex-wrap gap-2">
                      {!isEditing ? (
                        <>
                          <button type="button" onClick={() => startEdit(order)} className={ADMIN_BTN_ACCENT}>
                            Düzenle
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === order.id}
                            onClick={() => deleteOrder(order)}
                            className={`${ADMIN_BTN_DANGER} disabled:opacity-50`}
                          >
                            {deletingId === order.id ? "Siliniyor..." : "Sil"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" disabled={savingId === order.id} onClick={() => saveOrder(order.id)} className={`${ADMIN_BTN_SUCCESS} disabled:opacity-50`}>
                            {savingId === order.id ? "Kaydediliyor..." : "Kaydet"}
                          </button>
                          <button type="button" onClick={cancelEdit} className={ADMIN_BTN_SECONDARY}>İptal</button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing && editForm ? (
                    <div className="space-y-4 rounded-lg border border-[#9e4a5a]/20 bg-[#9e4a5a]/5 p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className={LABEL}>Sipariş Durumu</label>
                          <select className={SELECT} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s} className={ADMIN_OPTION}>{ORDER_STATUS_LABEL[s]}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={LABEL}>Kargo Takip No</label>
                          <input className={INPUT} value={editForm.tracking_number} onChange={(e) => setEditForm({ ...editForm, tracking_number: e.target.value })} />
                        </div>
                        <div>
                          <label className={LABEL}>Müşteri E-posta</label>
                          <input className={INPUT} type="email" value={editForm.guest_email} onChange={(e) => setEditForm({ ...editForm, guest_email: e.target.value })} />
                        </div>
                        <div>
                          <label className={LABEL}>Müşteri Telefonu</label>
                          <input className={INPUT} value={editForm.guest_phone} onChange={(e) => setEditForm({ ...editForm, guest_phone: e.target.value })} />
                        </div>
                        <div>
                          <label className={LABEL}>Alıcı Adı</label>
                          <input className={INPUT} value={editForm.shipping_address.full_name} onChange={(e) => setEditForm({ ...editForm, shipping_address: { ...editForm.shipping_address, full_name: e.target.value } })} />
                        </div>
                        <div>
                          <label className={LABEL}>Posta Kodu</label>
                          <input className={INPUT} value={editForm.shipping_address.postal_code ?? ""} onChange={(e) => setEditForm({ ...editForm, shipping_address: { ...editForm.shipping_address, postal_code: e.target.value } })} />
                        </div>
                      </div>
                      <div>
                        <label className={LABEL}>Teslimat Adresi</label>
                        <textarea className={`${INPUT} min-h-[72px]`} value={editForm.shipping_address.address_line} onChange={(e) => setEditForm({ ...editForm, shipping_address: { ...editForm.shipping_address, address_line: e.target.value } })} />
                      </div>
                      <div>
                        <label className={LABEL}>Müşteri Notu</label>
                        <textarea className={`${INPUT} min-h-[60px]`} value={editForm.customer_notes} onChange={(e) => setEditForm({ ...editForm, customer_notes: e.target.value })} />
                      </div>
                      <div>
                        <label className={LABEL}>Admin Notu</label>
                        <textarea className={`${INPUT} min-h-[60px]`} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Dahili not (müşteriye görünmez)" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Müşteri Bilgisi</p>
                          <div className="space-y-1 text-sm text-slate-700">
                            <p>{addr.full_name}</p>
                            <p>{order.guest_email}</p>
                            <p>{order.guest_phone}</p>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Teslimat Adresi</p>
                            <CopyAddressButton order={order} />
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700">{addr.address_line || `${addr.il} / ${addr.ilce}`}</p>
                          {addr.postal_code && <p className="text-sm text-slate-500">{addr.postal_code}</p>}
                        </div>
                      </div>

                      {order.customer_notes && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">Müşteri Notu</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{order.customer_notes}</p>
                        </div>
                      )}

                      {order.gift_wrap && (
                        <div className="rounded-lg border border-[#9e4a5a]/20 bg-[#9e4a5a]/5 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9e4a5a]">
                            Hediye Paketi (+{formatTRY(pricing.giftWrapTry)})
                          </p>
                          {order.gift_message ? (
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{order.gift_message}</p>
                          ) : (
                            <p className="mt-1 text-sm text-slate-500">Kart mesajı yok</p>
                          )}
                        </div>
                      )}

                      {order.notes && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-700">Admin Notu</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{order.notes}</p>
                        </div>
                      )}

                      {order.tracking_number && (
                        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-800">
                          Kargo Takip: <strong>{order.tracking_number}</strong>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Sipariş Kalemleri</p>
                    <div className="overflow-hidden rounded-lg border border-black/[0.06]">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-[11px] text-slate-500">
                          <tr>
                            <th className="px-3 py-2 text-left">Ürün</th>
                            <th className="px-3 py-2 text-center">Adet</th>
                            <th className="px-3 py-2 text-right">Tutar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                          {order.items.map((item, i) => {
                            const product = products.find((p) => p.id === item.product_id);
                            const thumb = product?.images?.[0];
                            return (
                            <tr key={i}>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  {thumb ? (
                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-black/[0.06] bg-slate-100">
                                      <Image src={thumb} alt={item.name_tr} fill className="object-cover" sizes="36px" />
                                    </div>
                                  ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-black/[0.06] bg-slate-100 text-[16px]">
                                      🛍️
                                    </div>
                                  )}
                                  <span className="font-medium text-slate-800">{item.name_tr}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center text-slate-600">{item.quantity}</td>
                              <td className="px-3 py-2 text-right text-slate-800">{formatTRY(item.unit_price_try * item.quantity)}</td>
                            </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50 text-[11px] text-slate-500">
                          <tr>
                            <td colSpan={2} className="px-3 py-2 text-right">Ara Toplam</td>
                            <td className="px-3 py-2 text-right">{formatTRY(pricing.subtotalTry)}</td>
                          </tr>
                          {pricing.shippingTry > 0 && (
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-right">Kargo</td>
                              <td className="px-3 py-2 text-right">{formatTRY(pricing.shippingTry)}</td>
                            </tr>
                          )}
                          {pricing.giftWrapTry > 0 && (
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-right font-medium text-[#9e4a5a]">+ Hediye Paketi</td>
                              <td className="px-3 py-2 text-right font-medium text-[#9e4a5a]">{formatTRY(pricing.giftWrapTry)}</td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={2} className="px-3 py-2 text-right font-semibold text-slate-700">Toplam</td>
                            <td className="px-3 py-2 text-right font-semibold text-emerald-700">{formatTRY(pricing.totalTry)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
                    <span>Sipariş: {formatAdminDate(order.created_at)}</span>
                    {order.paid_at && <span>Ödeme: {formatAdminDate(order.paid_at)}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
