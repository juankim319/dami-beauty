"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { getMessages } from "@/lib/i18n";

declare global {
  interface Window {
    iFrameResize?: (options: Record<string, unknown>, target: string | HTMLElement) => unknown;
  }
}

const PAYTR_RESIZER_SRC = "https://www.paytr.com/js/iframeResizer.min.js";
const IFRAME_ID = "paytriframe";

interface Props {
  iframeUrl: string;
  orderId: string;
  testMode?: boolean;
}

export function PayTRIframe({ iframeUrl, testMode = false }: Props) {
  const t = getMessages();
  const resizerStarted = useRef(false);

  const startResizer = () => {
    if (resizerStarted.current) return;
    const iframe = document.getElementById(IFRAME_ID);
    if (!iframe || !window.iFrameResize) return;
    window.iFrameResize({}, `#${IFRAME_ID}`);
    resizerStarted.current = true;
  };

  useEffect(() => {
    startResizer();
  }, [iframeUrl]);

  return (
    <>
      <Script src={PAYTR_RESIZER_SRC} strategy="afterInteractive" onLoad={startResizer} />
      <div className="flex h-full min-h-0 flex-col bg-white md:overflow-hidden md:rounded-dami md:border md:border-dami-200 md:shadow-card">
        {testMode && (
          <div className="shrink-0 border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-700">
              {t.paytr.testModeBanner}
            </p>
            <p className="mt-1 text-[11px] text-amber-600/90">{t.paytr.testModeHint}</p>
          </div>
        )}
        <div className="min-h-[calc(100dvh-7rem-env(safe-area-inset-top))] flex-1 md:min-h-0">
          <iframe
            id={IFRAME_ID}
            src={iframeUrl}
            title={t.paytr.title}
            className="block w-full border-0"
            scrolling="no"
            allow="payment *"
          />
        </div>
        <p className="shrink-0 border-t border-dami-100 px-4 py-3 text-center text-[11px] text-dami-500 md:py-4 md:text-xs">
          {t.paytr.secure}
        </p>
      </div>
    </>
  );
}
