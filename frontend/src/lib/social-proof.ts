export interface SocialProofEvent {
  city: string;
  product: string;
  minutesAgo: number;
  isReal?: boolean;
}

const TURKISH_CITIES = [
  "İzmir",
  "İstanbul",
  "Ankara",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Eskişehir",
  "Mersin",
  "Kocaeli",
  "Trabzon",
];

const FAKE_PRODUCTS = [
  "Lucky Scoop Set",
  "Burgundy Gift Box",
  "Rose Quartz Nail Tips",
  "Velvet Curation Set",
  "Champagne Glow Box",
  "Midnight Pearl Set",
  "Cherry Blossom Tips",
  "Dami Signature Box",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fakeEvent(): SocialProofEvent {
  return {
    city: pick(TURKISH_CITIES),
    product: pick(FAKE_PRODUCTS),
    minutesAgo: 1 + Math.floor(Math.random() * 18),
    isReal: false,
  };
}

export function buildSocialProofQueue(real: SocialProofEvent[]): SocialProofEvent[] {
  const queue: SocialProofEvent[] = [];
  const realCopy = real.map((e) => ({ ...e, isReal: true }));

  let ri = 0;
  for (let i = 0; i < 24; i++) {
    if (ri < realCopy.length && (i % 3 === 0 || Math.random() > 0.55)) {
      queue.push({ ...realCopy[ri], minutesAgo: Math.max(1, realCopy[ri].minutesAgo + (i % 4)) });
      ri++;
    } else {
      queue.push(fakeEvent());
    }
  }

  while (queue.length < 12) {
    queue.push(fakeEvent());
  }

  return queue;
}

export async function fetchRecentPurchases(): Promise<SocialProofEvent[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  try {
    const res = await fetch(`${base}/social-proof/recent`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { city: string; product: string; minutes_ago: number }[];
    return data.map((row) => ({
      city: row.city,
      product: row.product,
      minutesAgo: row.minutes_ago,
      isReal: true,
    }));
  } catch {
    return [];
  }
}
