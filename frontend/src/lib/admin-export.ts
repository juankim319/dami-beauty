import * as XLSX from "xlsx";
import type { Order, ShippingAddress } from "@/types";
import { ORDER_STATUS_LABEL } from "@/lib/admin-order-utils";
import { getOrderPriceBreakdown } from "@/lib/admin-order-pricing";

function tryToKurus(kurus: number): string {
  return (kurus / 100).toFixed(2);
}

export function formatAddressClipboard(order: Order): string {
  const a = order.shipping_address;
  const phone = order.guest_phone || a.phone;
  const street =
    a.address_line ||
    [a.mahalle, a.street, a.building_no, a.floor, a.apartment].filter(Boolean).join(" ");
  const region = [a.ilce, a.il, a.postal_code].filter(Boolean).join(" / ");

  return [a.full_name, phone, street, region].filter(Boolean).join("\n");
}

export function formatAddressOneLine(addr: ShippingAddress, phone: string): string {
  const street =
    addr.address_line ||
    [addr.mahalle, addr.street, addr.building_no, addr.floor, addr.apartment]
      .filter(Boolean)
      .join(" ");
  const region = [addr.ilce, addr.il, addr.postal_code].filter(Boolean).join(" ");
  return [addr.full_name, phone, street, region].filter(Boolean).join(" | ");
}

function itemsSummary(order: Order): string {
  return order.items.map((i) => `${i.name_tr} x${i.quantity}`).join("; ");
}

function formatExportDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadExcel(filename: string, sheetName: string, rows: (string | number)[][]) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export function filterOrdersByMonth(orders: Order[], year: number, month: number): Order[] {
  return orders.filter((o) => {
    if (!o.created_at) return false;
    const d = new Date(o.created_at);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export function exportSalesExcel(orders: Order[], year: number, month: number) {
  const monthOrders = filterOrdersByMonth(orders, year, month).filter(
    (o) => o.status !== "cancelled"
  );

  const rows: (string | number)[][] = [
    [
      "Sipariş No",
      "Sipariş Tarihi",
      "Ödeme Tarihi",
      "Durum",
      "Müşteri Adı",
      "E-posta",
      "Telefon",
      "Ürünler",
      "Adet",
      "Ara Toplam (TRY)",
      "Kargo (TRY)",
      "Hediye Paketi (TRY)",
      "Toplam (TRY)",
      "Hediye Paketi",
      "Kargo Takip",
    ],
  ];

  for (const o of monthOrders) {
    const qty = o.items.reduce((s, i) => s + i.quantity, 0);
    const pricing = getOrderPriceBreakdown(o);
    rows.push([
      o.id.slice(0, 8).toUpperCase(),
      formatExportDate(o.created_at),
      formatExportDate(o.paid_at),
      ORDER_STATUS_LABEL[o.status] ?? o.status,
      o.shipping_address.full_name,
      o.guest_email,
      o.guest_phone,
      itemsSummary(o),
      qty,
      tryToKurus(pricing.subtotalTry),
      tryToKurus(pricing.shippingTry),
      tryToKurus(pricing.giftWrapTry),
      tryToKurus(pricing.totalTry),
      o.gift_wrap ? "Y" : "N",
      o.tracking_number ?? "",
    ]);
  }

  const label = `${year}-${String(month).padStart(2, "0")}`;
  downloadExcel(`dami-sales-${label}.xlsx`, "Satış", rows);
}

export function exportShippingExcel(orders: Order[]) {
  const shippable = orders.filter((o) =>
    ["paid", "processing", "shipped", "delivered"].includes(o.status)
  );

  const rows: (string | number)[][] = [
    [
      "Sipariş No",
      "Alıcı",
      "Telefon",
      "E-posta",
      "İl",
      "İlçe",
      "Posta Kodu",
      "Adres",
      "Ürünler",
      "Toplam Adet",
      "Hediye Paketi",
      "Hediye Mesajı",
      "Müşteri Notu",
      "Durum",
    ],
  ];

  for (const o of shippable) {
    const a = o.shipping_address;
    const addr =
      a.address_line ||
      [a.mahalle, a.street, a.building_no, a.floor, a.apartment].filter(Boolean).join(" ");
    const qty = o.items.reduce((s, i) => s + i.quantity, 0);

    rows.push([
      o.id.slice(0, 8).toUpperCase(),
      a.full_name,
      o.guest_phone || a.phone,
      o.guest_email,
      a.il,
      a.ilce,
      a.postal_code ?? "",
      addr,
      itemsSummary(o),
      qty,
      o.gift_wrap ? "Evet" : "Hayır",
      o.gift_message ?? "",
      o.customer_notes ?? "",
      ORDER_STATUS_LABEL[o.status] ?? o.status,
    ]);
  }

  const stamp = new Date().toISOString().slice(0, 10);
  downloadExcel(`dami-shipping-${stamp}.xlsx`, "Kargo", rows);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}
