import { DISTRICTS, NEIGHBORHOODS, PROVINCES, STREETS } from "./data";

export { PROVINCES, DISTRICTS, NEIGHBORHOODS, STREETS };

export interface AddressParts {
  il: string;
  ilce: string;
  mahalle: string;
  street: string;
  building_no: string;
  floor: string;
  apartment: string;
  postal_code?: string;
}

export function getDistricts(il: string): string[] {
  return DISTRICTS[il] ?? [];
}

export function getNeighborhoods(il: string, ilce: string): string[] {
  return NEIGHBORHOODS[`${il}|${ilce}`] ?? [];
}

export function getStreets(il: string, ilce: string, mahalle: string): string[] {
  return STREETS[`${il}|${ilce}|${mahalle}`] ?? [];
}

/** Güneşli Mahallesi 1240. Sokak, No 4, Kat 2, Daire 3, Bağcılar, İstanbul, Türkiye */
export function buildFullAddress(parts: AddressParts): string {
  const segments: string[] = [];

  if (parts.mahalle.trim()) {
    const m = parts.mahalle.trim();
    segments.push(m.toLowerCase().includes("mahalle") ? m : `${m} Mahallesi`);
  }
  if (parts.street.trim()) segments.push(parts.street.trim());

  const detail: string[] = [];
  if (parts.building_no.trim()) detail.push(`No ${parts.building_no.trim()}`);
  if (parts.floor.trim()) detail.push(`Kat ${parts.floor.trim()}`);
  if (parts.apartment.trim()) detail.push(`Daire ${parts.apartment.trim()}`);
  if (detail.length) segments.push(detail.join(", "));

  if (parts.ilce.trim()) segments.push(parts.ilce.trim());
  if (parts.il.trim()) segments.push(parts.il.trim());
  segments.push("Türkiye");

  return segments.join(", ");
}

export function filterOptions(options: string[], query: string, limit = 20): string[] {
  const q = query.trim().toLocaleLowerCase("tr-TR");
  if (!q) return options.slice(0, limit);
  return options
    .filter((o) => o.toLocaleLowerCase("tr-TR").includes(q))
    .slice(0, limit);
}
