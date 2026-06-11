"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/i18n";
import { getViewerCount, tickViewerCount } from "@/lib/fomo";

interface Props {
  productId: string;
  stock: number;
  lowStockThreshold?: number;
}

export function ScarcityAlerts({ productId, stock, lowStockThreshold = 5 }: Props) {
  const t = getMessages();
  const [viewers, setViewers] = useState(2);

  useEffect(() => {
    setViewers(getViewerCount(productId));
    const id = setInterval(() => {
      setViewers((v) => tickViewerCount(productId, v));
    }, 12000 + Math.random() * 8000);
    return () => clearInterval(id);
  }, [productId]);

  const showLowStock = stock > 0 && stock <= Math.max(lowStockThreshold, 10);

  if (stock <= 0) return null;

  return (
    <div className="mt-5 space-y-2">
      <div className="flex items-center gap-2.5 rounded border border-dami-800/15 bg-dami-50/80 px-3.5 py-2.5 dark:border-dami-600/25 dark:bg-dami-900/30">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dami-600/40 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-dami-700 dark:bg-dami-400" />
        </span>
        <p className="text-[11px] font-medium tracking-wide text-dami-800 dark:text-dami-200">
          {t.fomo.viewers(viewers)}
        </p>
      </div>

      {showLowStock && (
        <div className="rounded border border-red-900/20 bg-red-950/[0.04] px-3.5 py-2.5 dark:border-red-400/20 dark:bg-red-950/20">
          <p className="text-[11px] font-medium leading-snug text-red-900/90 dark:text-red-300/90">
            {t.fomo.lowStock(stock)}
          </p>
        </div>
      )}
    </div>
  );
}
