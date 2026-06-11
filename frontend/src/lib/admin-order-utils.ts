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
  pending: { bg: "bg-amber-900/40", text: "text-amber-400" },
  paid: { bg: "bg-emerald-900/40", text: "text-emerald-400" },
  processing: { bg: "bg-blue-900/40", text: "text-blue-400" },
  shipped: { bg: "bg-purple-900/40", text: "text-purple-400" },
  delivered: { bg: "bg-teal-900/40", text: "text-teal-400" },
  cancelled: { bg: "bg-red-900/40", text: "text-red-400" },
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
