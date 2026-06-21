import { apiFetch } from "@/lib/api";

export interface AddressLookupItem {
  id: number;
  name: string;
}

export interface SettlementLookupItem extends AddressLookupItem {
  kind: "mahalle" | "koy";
  postal_code?: string | null;
}

export function fetchProvinces() {
  return apiFetch<AddressLookupItem[]>("/address/provinces", { timeoutMs: 15_000 });
}

export function fetchDistricts(provinceId: number) {
  return apiFetch<AddressLookupItem[]>(`/address/districts?province_id=${provinceId}`, {
    timeoutMs: 15_000,
  });
}

export function fetchSettlements(districtId: number) {
  return apiFetch<SettlementLookupItem[]>(`/address/settlements?district_id=${districtId}`, {
    timeoutMs: 20_000,
  });
}

export function fetchStreets(districtId: number, settlementId: number) {
  return apiFetch<AddressLookupItem[]>(
    `/address/streets?district_id=${districtId}&settlement_id=${settlementId}`,
    { timeoutMs: 30_000 },
  );
}
