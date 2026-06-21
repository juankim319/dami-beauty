import type { Order } from "@/types";

export const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  processing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal",
};

export const ORDER_STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
  paid: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
  processing: { bg: "bg-blue-50 border-blue-200", text: "text-blue-800" },
  shipped: { bg: "bg-purple-50 border-purple-200", text: "text-purple-800" },
  delivered: { bg: "bg-teal-50 border-teal-200", text: "text-teal-800" },
  cancelled: { bg: "bg-red-50 border-red-200", text: "text-red-800" },
};

export function formatAdminDate(s?: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isTodayOrder(order: Order) {
  if (!order.created_at) return false;
  const d = new Date(order.created_at);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isPendingOrder(order: Order) {
  return order.status === "paid" || order.status === "processing" || order.status === "pending";
}
