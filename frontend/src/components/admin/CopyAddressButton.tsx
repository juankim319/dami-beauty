"use client";

import { useState } from "react";
import type { Order } from "@/types";
import { copyToClipboard, formatAddressClipboard } from "@/lib/admin-export";

interface Props {
  order: Order;
  className?: string;
  label?: string;
  iconOnly?: boolean;
}

export function CopyAddressButton({ order, className = "", label = "Adres Kopyala", iconOnly = false }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(formatAddressClipboard(order));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 text-[11px] text-slate-300 transition-colors hover:border-[#00e5ff]/30 hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] ${iconOnly ? "p-2" : "px-2.5 py-1.5"} ${className}`}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {!iconOnly && "Kopyalandı"}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5">
            <rect x="9" y="9" width="11" height="11" rx="1.5" />
            <path strokeLinecap="round" d="M5 15V5a2 2 0 012-2h10" />
          </svg>
          {!iconOnly && label}
        </>
      )}
    </button>
  );
}
