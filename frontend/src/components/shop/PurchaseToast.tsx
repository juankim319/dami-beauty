"use client";

import { useEffect, useRef, useState } from "react";
import { getMessages } from "@/lib/i18n";
import {
  buildSocialProofQueue,
  fetchRecentPurchases,
  type SocialProofEvent,
} from "@/lib/social-proof";

const INTERVAL_MS = 10_000;
const VISIBLE_MS = 4_500;

export function PurchaseToast() {
  const t = getMessages();
  const [event, setEvent] = useState<SocialProofEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const queueRef = useRef<SocialProofEvent[]>([]);
  const idxRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let cancelled = false;

    fetchRecentPurchases().then((real) => {
      if (cancelled) return;
      queueRef.current = buildSocialProofQueue(real);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const showNext = () => {
      const queue = queueRef.current;
      if (queue.length === 0) return;

      const item = queue[idxRef.current % queue.length];
      idxRef.current += 1;

      setEvent(item);
      setVisible(true);

      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    };

    const first = setTimeout(showNext, 3_000);
    const interval = setInterval(showNext, INTERVAL_MS);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
      clearTimeout(hideTimer.current);
    };
  }, []);

  if (!event) return null;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-20 left-4 z-[45] max-w-[min(18rem,calc(100vw-2rem))] transition-all duration-500 md:bottom-6 ${
        visible
          ? "translate-x-0 opacity-100"
          : "-translate-x-4 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-xl border border-dami-200/80 bg-white/95 px-3.5 py-3 shadow-[0_8px_32px_rgba(74,14,35,0.12)] backdrop-blur-md dark:border-dami-700/50 dark:bg-[#1a1216]/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dami-100 text-sm dark:bg-dami-800/60">
          🛍️
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium leading-snug text-dami-900 dark:text-dami-50">
            {t.socialProof.justSold(event.city, event.product)}
          </p>
          <p className="mt-0.5 text-[10px] text-dami-400 dark:text-dami-500">
            {t.socialProof.timeAgo(event.minutesAgo)}
          </p>
        </div>
      </div>
    </div>
  );
}
