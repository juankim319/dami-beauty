import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import type { Order } from "@/types";
import { getMessages } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/contact";

interface Props {
  params: { id: string };
  searchParams: { status?: string };
}

export default async function OrderPage({ params, searchParams }: Props) {
  const t = getMessages();
  let order: Order | null = null;
  try {
    order = await apiFetch<Order>(`/orders/${params.id}`);
  } catch {
    order = null;
  }

  const isSuccess = searchParams.status === "success" || order?.status === "paid";
  const isProcessing = searchParams.status === "success" && order?.status === "pending";
  const orderShortId = order?.id.slice(0, 8).toUpperCase() ?? "";

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold">{t.order.notFound}</h1>
        <Link href="/" className="btn-primary mt-4 inline-flex">{t.order.home}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${isSuccess ? "bg-green-100" : "bg-dami-100"}`}>
        {isSuccess ? "✓" : "⏳"}
      </div>
      <h1 className="mt-4 text-2xl font-bold text-dami-900">
        {isProcessing ? t.order.processing : isSuccess ? t.order.success : t.order.detail}
      </h1>
      <p className="mt-2 text-dami-600">
        {t.order.number(orderShortId)}
      </p>
      {isProcessing && (
        <p className="mt-2 text-sm text-dami-500">{t.paytr.paymentProcessing}</p>
      )}
      {isSuccess && !isProcessing && (
        <p className="mt-2 text-sm text-dami-500">
          {t.order.emailSent(order.guest_email)}
        </p>
      )}

      <div className="card mt-8 text-left text-sm">
        <p className="flex justify-between">
          <span>{t.order.status}</span>
          <span className="font-medium">{t.orderStatus[order.status as keyof typeof t.orderStatus] || order.status}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span>{t.order.total}</span>
          <span className="font-bold">{formatTRY(order.total_try)}</span>
        </p>
        {order.tracking_number && (
          <p className="mt-2 flex justify-between">
            <span>{t.order.tracking}</span>
            <span className="font-medium">{order.tracking_number}</span>
          </p>
        )}
        <ul className="mt-4 space-y-2 border-t border-dami-100 pt-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.name_tr} × {item.quantity}</span>
              <span>{formatTRY(item.unit_price_try * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/products" className="btn-primary">{t.order.continueShop}</Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.order.whatsappMessage(orderShortId))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          {t.order.askWhatsapp}
        </a>
      </div>
    </div>
  );
}
