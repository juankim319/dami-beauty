"use client";

import { useEffect, useState } from "react";

function getTurkeyNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
}

function getSecondsUntilNoon(): number {
  const now = getTurkeyNow();
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (now >= noon) return 0;
  return Math.floor((noon.getTime() - now.getTime()) / 1000);
}

function formatHM(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}sa ${m.toString().padStart(2, "0")}dk`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function CartCountdownBanner() {
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setSecs(getSecondsUntilNoon());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (secs === null) return null;

  const beforeNoon = secs > 0;
  const progress = beforeNoon ? (secs / (12 * 3600)) * 100 : 0;

  return (
    <div className="mb-8 overflow-hidden rounded border border-dami-800/20 bg-dami-900 text-white">
      <div className="px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-dami-200/90">
              {beforeNoon
                ? "Bugün saat 12:00'ye kadar sipariş verin"
                : "Yarın kargoya çıkması için 12:00'ye kadar sipariş verin"}
            </p>
            <p className="mt-0.5 text-[10px] text-dami-300/70">
              {beforeNoon ? "Aynı gün kargoya giriş yapılır" : "Bugün 12:00 geçti — yarın kargoya!"}
            </p>
          </div>
          {beforeNoon && (
            <span className="font-mono text-2xl font-light tabular-nums tracking-wider text-[#e8dcc8]">
              {formatHM(secs)}
            </span>
          )}
        </div>
      </div>
      {beforeNoon && (
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
