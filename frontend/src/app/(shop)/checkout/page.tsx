"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import type { Order, ShippingAddress } from "@/types";
import { PayTRIframe } from "@/components/shop/PayTRIframe";
import { TurkishAddressForm } from "@/components/shop/TurkishAddressForm";
import { buildFullAddress } from "@/lib/turkish-address";
import { getMessages } from "@/lib/i18n";

const t = getMessages();

const FREE_SHIPPING = 99999;   // ₺999,99
const SHIPPING_COST = 4900;    // ₺49
const GIFT_WRAP_COST = 5000;   // ₺50

const EMPTY_ADDRESS: Omit<ShippingAddress, "full_name" | "phone" | "email"> = {
  il: "İstanbul",
  ilce: "",
  mahalle: "",
  street: "",
  building_no: "",
  floor: "",
  apartment: "",
  address_line: "",
  postal_code: "",
};

export default function CheckoutPage() {
  const { items, subtotalTry, clearCart, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [consentLegal, setConsentLegal] = useState(false);
  const [consentKvk, setConsentKvk] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [contact, setContact] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState({ ...EMPTY_ADDRESS });

  const shipping = subtotalTry >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0;
  const total = subtotalTry + shipping + giftWrapCost;

  if (itemCount === 0 && !orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-gray-500">{t.checkout.empty}</p>
        <Link href="/products" className="btn-primary mt-4 inline-flex">
          {t.checkout.goProducts}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentLegal || !consentKvk) {
      setError(t.checkout.legalRequired);
      return;
    }
    if (!contact.full_name.trim() || !contact.email.trim() || !contact.phone.trim()) {
      setError("Lütfen adınızı, e-postanızı ve telefon numaranızı girin.");
      return;
    }
    if (!address.ilce.trim() || !address.mahalle.trim() || !address.street.trim() || !address.building_no.trim()) {
      setError("Lütfen teslimat adresini eksiksiz doldurun.");
      return;
    }

    const shippingAddress: ShippingAddress = {
      ...contact,
      ...address,
      address_line: buildFullAddress(address),
    };

    setLoading(true);
    setError("");

    try {
      const order = await apiFetch<Order>("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.productId,
            variant_sku: i.variantSku,
            quantity: i.quantity,
          })),
          shipping_address: shippingAddress,
          gift_wrap: giftWrap,
          gift_message: giftMessage || null,
          customer_notes: customerNotes.trim() || null,
        }),
      });

      const paytr = await apiFetch<{ token: string; iframe_url: string }>(
        "/payment/paytr/token",
        { method: "POST", body: JSON.stringify({ order_id: order.id }) }
      );

      const devMode = paytr.token.startsWith("TEST_TOKEN_");
      setOrderId(order.id);
      setIframeUrl(paytr.iframe_url);
      setIsDevMode(devMode);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.checkout.orderFailed);
    } finally {
      setLoading(false);
    }
  };

  if (iframeUrl && orderId) {
    if (isDevMode) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              Geliştirici Modu (PayTR anahtarı tanımlı değil)
            </p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">Sipariş oluşturuldu</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sipariş No: <strong>#{orderId.slice(0, 8).toUpperCase()}</strong>
            </p>
            <Link href={`/order/${orderId}?status=success`} className="btn-primary mt-6 inline-block">
              Siparişi Görüntüle
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="section-title mb-4">{t.checkout.title}</h1>
        <PayTRIframe iframeUrl={iframeUrl} orderId={orderId} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="mb-8">
        <p className="section-label">{t.brand.name}</p>
        <h1 className="mt-1 section-title">{t.checkout.title}</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Contact */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              01 · İletişim Bilgileri
            </h2>
            <div className="space-y-3">
              <div>
                <label className="section-label mb-1 block">Ad Soyad *</label>
                <input
                  className="input-field"
                  placeholder="Ad Soyad"
                  value={contact.full_name}
                  onChange={(e) => setContact({ ...contact, full_name: e.target.value })}
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="section-label mb-1 block">E-posta *</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="example@email.com"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="section-label mb-1 block">Telefon *</label>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              02 · Teslimat Adresi
            </h2>
            <TurkishAddressForm
              value={{ ...address, address_line: buildFullAddress(address) }}
              onChange={(v) => setAddress(v)}
            />
          </section>

          {/* Options + notes */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              03 · Seçenekler & Notlar
            </h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="h-5 w-5 accent-dami-700"
                />
                <span className="text-sm text-gray-700">
                  Hediye Paketi <span className="text-gray-400">(+{formatTRY(GIFT_WRAP_COST)})</span>
                </span>
              </label>
              {giftWrap && (
                <div>
                  <label className="section-label mb-1 block">Hediye Mesajı (İsteğe Bağlı)</label>
                  <textarea
                    className="input-field min-h-[72px]"
                    placeholder="Karta yazılacak mesajı girin..."
                    value={giftMessage}
                    maxLength={200}
                    onChange={(e) => setGiftMessage(e.target.value)}
                  />
                  <p className="mt-1 text-right text-[10px] text-gray-400">{giftMessage.length}/200</p>
                </div>
              )}
              <div>
                <label className="section-label mb-1 block">Sipariş Notu (İsteğe Bağlı)</label>
                <textarea
                  className="input-field min-h-[88px]"
                  placeholder="Teslimat saati, iletişim tercihi veya özel isteklerinizi yazın..."
                  value={customerNotes}
                  maxLength={500}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
                <p className="mt-1 text-right text-[10px] text-gray-400">{customerNotes.length}/500</p>
              </div>
            </div>
          </section>

          {/* Legal */}
          <section className="space-y-3 text-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consentLegal}
                onChange={(e) => setConsentLegal(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-dami-700"
              />
              <span className="text-gray-600">
                <Link href="/legal/mesafeli-satis" className="font-medium text-dami-700 underline underline-offset-2" target="_blank">
                  Mesafeli Satış Sözleşmesi
                </Link>
                &apos;ni okudum ve kabul ediyorum.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consentKvk}
                onChange={(e) => setConsentKvk(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-dami-700"
              />
              <span className="text-gray-600">
                <Link href="/legal/gizlilik" className="font-medium text-dami-700 underline underline-offset-2" target="_blank">
                  Gizlilik Politikası (KVKK)
                </Link>
                &apos;nı okudum ve kabul ediyorum.
              </span>
            </label>
          </section>

          {error && (
            <div className="rounded bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !consentLegal || !consentKvk}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sipariş işleniyor...
              </span>
            ) : (
              `${formatTRY(total)} · PayTR ile Öde`
            )}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            PayTR Güvenli Ödeme · SSL Şifreli
          </p>
        </form>

        {/* Order summary */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Sipariş Özeti
            </h2>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantSku}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-300">—</div>
                    )}
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-dami-700 text-[10px] font-medium text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-gray-800">{item.name}</p>
                    {Object.entries(item.options).map(([k, v]) => (
                      <p key={k} className="text-[11px] text-gray-500">{k}: {v}</p>
                    ))}
                  </div>
                  <p className="shrink-0 text-[12px] font-medium text-gray-800">
                    {formatTRY(item.unitPriceTry * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span>{formatTRY(subtotalTry)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span>{shipping === 0 ? "Ücretsiz" : formatTRY(shipping)}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Hediye Paketi</span>
                  <span>{formatTRY(GIFT_WRAP_COST)}</span>
                </div>
              )}
              {subtotalTry < FREE_SHIPPING && (
                <p className="text-[11px] text-gray-400">
                  {formatTRY(FREE_SHIPPING - subtotalTry)} daha ekleyin, kargo bedava!
                </p>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                <span>Toplam</span>
                <span>{formatTRY(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
