"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/i18n";
import { CART_TIMER_MS, formatCountdown, getCartTimerEnd, startCartTimer } from "@/lib/fomo";

export function CartCountdownBanner() {
  const t = getMessages();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let end = getCartTimerEnd();
    if (!end || end <= Date.now()) {
      end = startCartTimer();
    }

    const tick = () => {
      const left = end! - Date.now();
      setRemaining(left > 0 ? left : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const expired = remaining <= 0;
  const progress = expired ? 0 : (remaining / CART_TIMER_MS) * 100;

  return (
    <div className="mb-8 overflow-hidden rounded border border-dami-800/20 bg-dami-900 text-white">
      <div className="px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-dami-200/90">
              {expired ? t.fomo.cartTimerExpired : t.fomo.cartTimerTitle}
            </p>
            {!expired && (
              <p className="mt-0.5 text-[10px] text-dami-300/70">{t.fomo.cartTimerSubtitle}</p>
            )}
          </div>
          {!expired && (
            <span className="font-mono text-2xl font-light tabular-nums tracking-wider text-[#e8dcc8]">
              {formatCountdown(remaining)}
            </span>
          )}
        </div>
      </div>
      {!expired && (
        <div className="h-0.5 bg-dami-800">
          <div
            className="h-full bg-[#c9b08a] transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
