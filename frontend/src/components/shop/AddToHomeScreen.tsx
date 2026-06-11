"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMessages } from "@/lib/i18n";

const DISMISS_KEY = "dami_a2hs_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function AddToHomeScreen() {
  const t = getMessages();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  const onProductDetail = /^\/products\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (onProductDetail || isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);

    const timer = setTimeout(() => {
      if (isStandalone() || sessionStorage.getItem(DISMISS_KEY)) return;
      if (isIOS()) {
        setIosHint(true);
        setVisible(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      clearTimeout(timer);
    };
  }, [onProductDetail]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      dismiss();
      return;
    }
    if (iosHint) {
      setVisible(true);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-dami-800/20 bg-dami-900/95 px-4 py-3.5 shadow-2xl backdrop-blur-md pb-[max(0.875rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex max-w-lg items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dami-800 text-lg font-semibold text-[#e8dcc8]">
          D
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-white">{t.pwa.title}</p>
          {iosHint ? (
            <p className="mt-0.5 text-[11px] leading-snug text-dami-300/80">{t.pwa.iosSteps}</p>
          ) : (
            <p className="mt-0.5 text-[11px] text-dami-300/80">{t.pwa.subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          {!iosHint && (
            <button
              type="button"
              onClick={install}
              className="rounded-lg bg-[#e8dcc8] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-dami-900"
            >
              {t.pwa.install}
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="text-[10px] text-dami-400 underline-offset-2 hover:underline"
          >
            {t.pwa.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
