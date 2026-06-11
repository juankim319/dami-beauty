"use client";

import { getMessages } from "@/lib/i18n";

interface Props {
  iframeUrl: string;
  orderId: string;
}

export function PayTRIframe({ iframeUrl }: Props) {
  const t = getMessages();

  return (
    <div className="overflow-hidden rounded-dami border border-dami-200 bg-white shadow-card">
      <iframe
        src={iframeUrl}
        title={t.paytr.title}
        className="h-[600px] w-full border-0"
        allow="payment"
      />
      <p className="p-4 text-center text-xs text-dami-500">{t.paytr.secure}</p>
    </div>
  );
}
