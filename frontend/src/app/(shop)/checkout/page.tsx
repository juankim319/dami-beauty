"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import type { Order, ShippingAddress, CartItem } from "@/types";
import { PayTRIframe } from "@/components/shop/PayTRIframe";
import { CheckoutPaymentAlert } from "@/components/shop/CheckoutPaymentAlert";
import { TurkishAddressForm } from "@/components/shop/TurkishAddressForm";
import { buildFullAddress } from "@/lib/turkish-address";
import { getMessages } from "@/lib/i18n";

const t = getMessages();

interface PayTRTokenResult {
  token: string;
  iframe_url: string;
  test_mode: boolean;
  dev_mock: boolean;
}

const FREE_SHIPPING = 99999;   // ₺999,99
const SHIPPING_COST = 15000;   // ₺150
const GIFT_WRAP_COST = 5000;   // ₺50

const EMPTY_ADDRESS: Omit<ShippingAddress, "full_name" | "phone" | "email"> = {
  il: "",
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
  const [paytrTestMode, setPaytrTestMode] = useState(false);
  const [isDevMock, setIsDevMock] = useState(false);
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
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [blockAutofill, setBlockAutofill] = useState(true);
  const formFieldId = useId();
  const addressFormKey = useRef(`checkout-address-${Date.now()}`).current;

  useEffect(() => {
    setAddress({ ...EMPTY_ADDRESS });
    setContact({ full_name: "", phone: "", email: "" });
    setGiftWrap(false);
    setGiftMessage("");
    setCustomerNotes("");
    setConsentLegal(false);
    setConsentKvk(false);
    setError("");
  }, []);
  const shipping = subtotalTry >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0;
  const total = subtotalTry + shipping + giftWrapCost;

  const handlePaymentFailed = useCallback((failedOrderId: string | null) => {
    setError(t.paytr.paymentFailed);
    if (failedOrderId) setOrderId(failedOrderId);
    setIframeUrl(null);
    setIsDevMock(false);
    setPaytrTestMode(false);
  }, []);

  useEffect(() => {
    if (!iframeUrl) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [iframeUrl]);

  if (itemCount === 0 && !orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center animate-fade-in-up">
        <p className="section-label">{t.brand.name}</p>
        <p className="mt-3 text-sm text-dami-500">{t.checkout.empty}</p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
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

      const paytr = await apiFetch<PayTRTokenResult>(
        "/payment/paytr/token",
        { method: "POST", body: JSON.stringify({ order_id: order.id }) }
      );

      setOrderId(order.id);
      setIframeUrl(paytr.iframe_url);
      setPaytrTestMode(paytr.test_mode);
      setIsDevMock(paytr.dev_mock);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.checkout.orderFailed);
    } finally {
      setLoading(false);
    }
  };

  if (iframeUrl && orderId) {
    if (isDevMock) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              {t.paytr.devMockBanner}
            </p>
            <p className="mt-2 text-sm text-amber-700/90">{t.paytr.devMockHint}</p>
            <h2 className="mt-4 text-lg font-medium text-dami-900">Sipariş oluşturuldu</h2>
            <p className="mt-2 text-sm text-dami-600">
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
      <div className="fixed inset-0 z-[200] flex flex-col bg-[#FDFAF9] md:static md:z-auto md:min-h-0">
        <div className="shrink-0 border-b border-dami-200 bg-[#FDFAF9]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm md:mx-auto md:max-w-2xl md:w-full md:border-0 md:bg-transparent md:px-4 md:pt-8 md:backdrop-blur-none">
          <p className="section-label">{t.brand.name}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h1 className="text-base font-medium tracking-wide text-dami-900 md:section-title">{t.paytr.title}</h1>
            <span className="shrink-0 text-[11px] tabular-nums text-dami-500">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto md:mx-auto md:max-w-2xl md:w-full md:overflow-visible md:px-4 md:pb-8">
          <PayTRIframe iframeUrl={iframeUrl} orderId={orderId} testMode={paytrTestMode} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <CheckoutPaymentAlert onPaymentFailed={handlePaymentFailed} />
      </Suspense>
      <div className="checkout-shell fixed inset-0 z-[200] flex flex-col bg-[#FDFAF9] md:static md:z-auto md:min-h-0 md:bg-transparent">
        {/* Mobile checkout header */}
        <div className="shrink-0 border-b border-dami-200 bg-[#FDFAF9]/95 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Link
              href="/cart"
              aria-label={t.nav.cart}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dami-200 bg-white text-dami-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0 flex-1">
              <p className="section-label">{t.brand.name}</p>
              <h1 className="truncate text-base font-medium text-dami-900">{t.checkout.title}</h1>
            </div>
            <span className="shrink-0 rounded-full bg-dami-100 px-2.5 py-1 text-[11px] font-medium tabular-nums text-dami-700">
              {itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="flex w-full items-center justify-between border-t border-dami-200 px-4 py-3 text-left"
          >
            <span className="text-[12px] font-medium text-dami-800">Sipariş Özeti</span>
            <span className="flex items-center gap-2 text-[12px] tabular-nums text-dami-700">
              {formatTRY(total)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-dami-400 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {summaryOpen && (
            <div className="max-h-[40vh] overflow-y-auto border-t border-dami-200 bg-white px-4 py-4">
              <CheckoutOrderSummary
                items={items}
                subtotalTry={subtotalTry}
                shipping={shipping}
                giftWrap={giftWrap}
                total={total}
                compact
              />
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:overflow-visible">
          <div className="mx-auto max-w-5xl md:px-4 md:py-14">
            <div className="mb-8 hidden md:block">
              <p className="section-label">{t.brand.name}</p>
              <h1 className="mt-1 section-title">{t.checkout.title}</h1>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6 px-4 py-5 pb-28 md:space-y-8 md:px-0 md:py-0 md:pb-0" noValidate autoComplete="off">
          {/* Honeypot fields — absorb browser autofill, never shown */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0">
            <input type="text" name="street-address" tabIndex={-1} autoComplete="street-address" />
            <input type="text" name="address-line1" tabIndex={-1} autoComplete="address-line1" />
            <input type="text" name="address-line2" tabIndex={-1} autoComplete="address-line2" />
            <input type="text" name="city" tabIndex={-1} autoComplete="address-level2" />
            <input type="text" name="door" tabIndex={-1} autoComplete="on" defaultValue="4" />
            <input type="text" name="floor" tabIndex={-1} autoComplete="on" defaultValue="2" />
            <input type="text" name="unit" tabIndex={-1} autoComplete="on" defaultValue="3" />
            <input type="text" name="email" tabIndex={-1} autoComplete="email" />
            <input type="tel" name="phone" tabIndex={-1} autoComplete="tel" />
          </div>
          {/* Contact */}
          <section>
            <h2 className="step-heading">01 · İletişim Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <label className="section-label mb-1 block">Ad Soyad *</label>
                <input
                  className="input-field"
                  placeholder="Ad Soyad"
                  value={contact.full_name}
                  onChange={(e) => setContact({ ...contact, full_name: e.target.value })}
                  readOnly={blockAutofill}
                  onFocus={() => setBlockAutofill(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  name={`${formFieldId}_name`}
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
                  readOnly={blockAutofill}
                  onFocus={() => setBlockAutofill(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  name={`${formFieldId}_email`}
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
                  readOnly={blockAutofill}
                  onFocus={() => setBlockAutofill(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  name={`${formFieldId}_phone`}
                  required
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="step-heading">02 · Teslimat Adresi</h2>
            <TurkishAddressForm
              key={addressFormKey}
              value={{ ...address, address_line: buildFullAddress(address) }}
              onChange={(v) => setAddress(v)}
            />
          </section>

          {/* Options + notes */}
          <section>
            <h2 className="step-heading">03 · Seçenekler & Notlar</h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="h-5 w-5 accent-dami-700"
                />
                <span className="text-sm text-dami-700">
                  Hediye Paketi <span className="text-dami-400">(+{formatTRY(GIFT_WRAP_COST)})</span>
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
                  <p className="mt-1 text-right text-[10px] text-dami-400">{giftMessage.length}/200</p>
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
                <p className="mt-1 text-right text-[10px] text-dami-400">{customerNotes.length}/500</p>
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
              <span className="text-dami-600">
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
              <span className="text-dami-600">
                <Link href="/legal/gizlilik" className="font-medium text-dami-700 underline underline-offset-2" target="_blank">
                  Gizlilik Politikası (KVKK)
                </Link>
                &apos;nı okudum ve kabul ediyorum.
              </span>
            </label>
          </section>

          {error && (
            <div className="hidden rounded-xl bg-red-50 px-4 py-3 md:block md:rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="hidden md:block">
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
            <p className="mt-3 text-center text-[11px] text-dami-400">
              PayTR Güvenli Ödeme · SSL Şifreli
            </p>
          </div>
        </form>

        <aside className="hidden space-y-4 lg:sticky lg:top-20 lg:block lg:self-start">
          <div className="surface-card">
            <CheckoutOrderSummary
              items={items}
              subtotalTry={subtotalTry}
              shipping={shipping}
              giftWrap={giftWrap}
              total={total}
            />
          </div>
        </aside>
      </div>
          </div>
        </div>

        {/* Mobile sticky pay bar */}
        <div className="shrink-0 border-t border-dami-200 bg-white/95 px-4 pt-3 backdrop-blur-sm pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
          {error && (
            <p className="mb-2 text-center text-[12px] text-red-600">{error}</p>
          )}
          <button
            type="submit"
            form="checkout-form"
            disabled={loading || !consentLegal || !consentKvk}
            className="btn-primary w-full py-4 text-[11px] disabled:opacity-50"
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
          <p className="mt-2 text-center text-[10px] text-dami-400">PayTR Güvenli Ödeme · SSL Şifreli</p>
        </div>
      </div>
    </>
  );
}

function CheckoutOrderSummary({
  items,
  subtotalTry,
  shipping,
  giftWrap,
  total,
  compact = false,
}: {
  items: CartItem[];
  subtotalTry: number;
  shipping: number;
  giftWrap: boolean;
  total: number;
  compact?: boolean;
}) {
  return (
    <>
      {!compact && <h2 className="step-heading">Sipariş Özeti</h2>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantSku}`} className="flex gap-3">
            <div className={`relative shrink-0 overflow-hidden bg-dami-100 ${compact ? "h-12 w-12" : "h-14 w-14"}`}>
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-dami-300">—</div>
              )}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate font-medium uppercase tracking-wide text-dami-800 ${compact ? "text-[11px]" : "text-[12px]"}`}>
                {item.name}
              </p>
              {!compact &&
                Object.entries(item.options).map(([k, v]) => (
                  <p key={k} className="text-[11px] text-dami-500">
                    {k}: {v}
                  </p>
                ))}
            </div>
            <p className={`shrink-0 font-medium text-dami-800 ${compact ? "text-[11px]" : "text-[12px]"}`}>
              {formatTRY(item.unitPriceTry * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div className={`space-y-2 text-sm text-dami-600 ${compact ? "mt-3 border-t border-dami-200 pt-3" : "mt-5 border-t border-dami-200 pt-4"}`}>
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
        {!compact && subtotalTry < FREE_SHIPPING && (
          <p className="text-[11px] text-dami-400">
            {formatTRY(FREE_SHIPPING - subtotalTry)} daha ekleyin, kargo bedava!
          </p>
        )}
        <div className={`flex justify-between border-t border-dami-200 pt-3 font-medium text-dami-900 ${compact ? "text-sm" : "text-base"}`}>
          <span>Toplam</span>
          <span>{formatTRY(total)}</span>
        </div>
      </div>
    </>
  );
}
