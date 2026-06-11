"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { EXIT_OFFER_KEY } from "@/lib/fomo";

const SKIP_PREFIXES = ["/checkout", "/order", "/admin"];

export function ExitIntentOffer() {
  const t = getMessages();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const shouldSkip = SKIP_PREFIXES.some((p) => pathname.startsWith(p));

  const showOnce = useCallback(() => {
    if (shouldSkip) return;
    if (sessionStorage.getItem(EXIT_OFFER_KEY)) return;
    sessionStorage.setItem(EXIT_OFFER_KEY, "1");
    setOpen(true);
  }, [shouldSkip]);

  useEffect(() => {
    if (shouldSkip) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 8) showOnce();
    };

    window.history.pushState({ exitTrap: true }, "");
    const onPopState = () => {
      showOnce();
      window.history.pushState({ exitTrap: true }, "");
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    };
  }, [shouldSkip, showOnce]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 p-4 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-dami-200 bg-white p-6 shadow-2xl dark:border-dami-700 dark:bg-[#1a1216] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dami-500">
          {t.fomo.exitTitle}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-dami-800">
          {t.fomo.exitBody}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="btn-primary flex-1 text-center text-xs"
          >
            {t.fomo.exitCta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 border border-dami-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-dami-500 transition hover:border-dami-400 hover:text-dami-800"
          >
            {t.fomo.exitDismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
