export const CART_TIMER_MS = 15 * 60 * 1000;
export const CART_TIMER_KEY = "dami_cart_timer_end";
export const EXIT_OFFER_KEY = "dami_exit_offer_shown";
const VIEWERS_PREFIX = "dami_viewers_";

export function getViewerCount(productId: string, min = 2, max = 9): number {
  if (typeof window === "undefined") return min;
  const key = VIEWERS_PREFIX + productId;
  const stored = sessionStorage.getItem(key);
  if (stored) return parseInt(stored, 10);

  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash + productId.charCodeAt(i)) | 0;
  }
  const n = min + (Math.abs(hash) % (max - min + 1));
  sessionStorage.setItem(key, String(n));
  return n;
}

export function tickViewerCount(productId: string, current: number): number {
  const delta = Math.random() > 0.65 ? (Math.random() > 0.45 ? 1 : -1) : 0;
  const next = Math.max(2, Math.min(11, current + delta));
  sessionStorage.setItem(VIEWERS_PREFIX + productId, String(next));
  return next;
}

export function startCartTimer(): number {
  const end = Date.now() + CART_TIMER_MS;
  sessionStorage.setItem(CART_TIMER_KEY, String(end));
  return end;
}

export function getCartTimerEnd(): number | null {
  const raw = sessionStorage.getItem(CART_TIMER_KEY);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
