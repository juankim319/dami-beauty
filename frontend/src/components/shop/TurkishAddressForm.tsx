"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { AddressCombobox } from "./AddressCombobox";
import {
  buildFullAddress,
  fetchDistricts,
  fetchProvinces,
  fetchSettlements,
  fetchStreets,
  type AddressParts,
  type SettlementLookupItem,
} from "@/lib/turkish-address";

export interface TurkishAddressValue extends AddressParts {
  address_line: string;
}

interface Props {
  value: TurkishAddressValue;
  onChange: (value: TurkishAddressValue) => void;
}

function withLine(parts: AddressParts): TurkishAddressValue {
  return { ...parts, address_line: buildFullAddress(parts) };
}

export function TurkishAddressForm({ value, onChange }: Props) {
  const fieldId = useId();
  const [unlockBno, setUnlockBno] = useState(false);
  const [unlockFloor, setUnlockFloor] = useState(false);
  const [unlockApt, setUnlockApt] = useState(false);
  const [unlockPostal, setUnlockPostal] = useState(false);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [settlementId, setSettlementId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [settlements, setSettlements] = useState<SettlementLookupItem[]>([]);
  const [streets, setStreets] = useState<{ id: number; name: string }[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoadingProvinces(true);
    fetchProvinces()
      .then((rows) => {
        if (cancelled) return;
        setProvinces(rows);
        if (value.il) {
          const match = rows.find((p) => p.name === value.il);
          if (match) setProvinceId(match.id);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Adres listesi yüklenemedi. Lütfen sayfayı yenileyin.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProvinces(false);
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }

    let cancelled = false;
    setLoadingDistricts(true);
    fetchDistricts(provinceId)
      .then((rows) => {
        if (cancelled) return;
        setDistricts(rows);
        if (value.ilce) {
          const match = rows.find((d) => d.name === value.ilce);
          if (match) setDistrictId(match.id);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("İlçe listesi yüklenemedi.");
      })
      .finally(() => {
        if (!cancelled) setLoadingDistricts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [provinceId, value.ilce]);

  useEffect(() => {
    if (!districtId) {
      setSettlements([]);
      return;
    }

    let cancelled = false;
    setLoadingSettlements(true);
    fetchSettlements(districtId)
      .then((rows) => {
        if (cancelled) return;
        setSettlements(rows);
        if (value.mahalle) {
          const match = rows.find((s) => s.name === value.mahalle);
          if (match) setSettlementId(match.id);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Mahalle listesi yüklenemedi.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSettlements(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districtId, value.mahalle]);

  useEffect(() => {
    if (!districtId || !settlementId) {
      setStreets([]);
      return;
    }

    let cancelled = false;
    setLoadingStreets(true);
    fetchStreets(districtId, settlementId)
      .then((rows) => {
        if (!cancelled) setStreets(rows);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Cadde/sokak listesi yüklenemedi.");
      })
      .finally(() => {
        if (!cancelled) setLoadingStreets(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districtId, settlementId]);

  const provinceNames = useMemo(() => provinces.map((p) => p.name), [provinces]);
  const districtNames = useMemo(() => districts.map((d) => d.name), [districts]);
  const settlementNames = useMemo(() => settlements.map((s) => s.name), [settlements]);
  const streetNames = useMemo(() => streets.map((s) => s.name), [streets]);

  const update = useCallback(
    (patch: Partial<AddressParts>) => {
      const next: AddressParts = { ...value, ...patch };
      onChange(withLine(next));
    },
    [value, onChange],
  );

  const selectProvince = (name: string) => {
    const row = provinces.find((p) => p.name === name);
    setProvinceId(row?.id ?? null);
    setDistrictId(null);
    setSettlementId(null);
    update({
      il: name,
      ilce: "",
      mahalle: "",
      street: "",
      settlement_kind: undefined,
      postal_code: "",
    });
  };

  const selectDistrict = (name: string) => {
    const row = districts.find((d) => d.name === name);
    setDistrictId(row?.id ?? null);
    setSettlementId(null);
    update({
      ilce: name,
      mahalle: "",
      street: "",
      settlement_kind: undefined,
      postal_code: "",
    });
  };

  const selectSettlement = (name: string) => {
    const row = settlements.find((s) => s.name === name);
    setSettlementId(row?.id ?? null);
    update({
      mahalle: name,
      street: "",
      settlement_kind: row?.kind,
      postal_code: row?.postal_code ?? "",
    });
  };

  return (
    <div className="space-y-3">
      {loadError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{loadError}</p>
      )}

      <AddressCombobox
        label="İl"
        value={value.il}
        onChange={selectProvince}
        options={provinceNames}
        placeholder="İl seçin"
        required
        loading={loadingProvinces}
        strict
        emptyHint="İl listesi yüklenemedi."
        inputName={`${fieldId}_il`}
      />

      <AddressCombobox
        label="İlçe"
        value={value.ilce}
        onChange={selectDistrict}
        options={districtNames}
        placeholder="İlçe seçin"
        required
        disabled={!value.il || !provinceId}
        loading={loadingDistricts}
        strict
        emptyHint={value.il ? "Bu il için ilçe bulunamadı." : "Önce il seçin."}
        inputName={`${fieldId}_ilce`}
      />

      <AddressCombobox
        label="Mahalle / Köy"
        value={value.mahalle}
        onChange={selectSettlement}
        options={settlementNames}
        placeholder="Mahalle veya köy seçin"
        required
        disabled={!value.ilce || !districtId}
        loading={loadingSettlements}
        strict
        emptyHint={value.ilce ? "Bu ilçe için mahalle/köy bulunamadı." : "Önce ilçe seçin."}
        inputName={`${fieldId}_mahalle`}
      />

      <AddressCombobox
        label="Cadde / Sokak"
        value={value.street}
        onChange={(street) => update({ street })}
        options={streetNames}
        placeholder="Cadde veya sokak seçin"
        required
        disabled={!value.mahalle || !settlementId}
        loading={loadingStreets}
        strict
        emptyHint={value.mahalle ? "Bu mahalle için cadde/sokak bulunamadı." : "Önce mahalle seçin."}
        inputName={`${fieldId}_street`}
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div>
          <label className="section-label mb-1 block">Kapı No *</label>
          <input
            className="input-field"
            placeholder=""
            value={value.building_no}
            onChange={(e) => update({ building_no: e.target.value })}
            readOnly={!unlockBno}
            onFocus={() => setUnlockBno(true)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="numeric"
            data-lpignore="true"
            data-1p-ignore="true"
            name={`${fieldId}_bno`}
            required
          />
        </div>
        <div>
          <label className="section-label mb-1 block">Kat</label>
          <input
            className="input-field"
            placeholder=""
            value={value.floor}
            onChange={(e) => update({ floor: e.target.value })}
            readOnly={!unlockFloor}
            onFocus={() => setUnlockFloor(true)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="numeric"
            data-lpignore="true"
            data-1p-ignore="true"
            name={`${fieldId}_floor`}
          />
        </div>
        <div>
          <label className="section-label mb-1 block">Daire</label>
          <input
            className="input-field"
            placeholder=""
            value={value.apartment}
            onChange={(e) => update({ apartment: e.target.value })}
            readOnly={!unlockApt}
            onFocus={() => setUnlockApt(true)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="numeric"
            data-lpignore="true"
            data-1p-ignore="true"
            name={`${fieldId}_apt`}
          />
        </div>
      </div>

      <div>
        <label className="section-label mb-1 block">Posta Kodu (İsteğe Bağlı)</label>
        <input
          className="input-field"
          placeholder=""
          value={value.postal_code ?? ""}
          onChange={(e) => update({ postal_code: e.target.value })}
          readOnly={!unlockPostal}
          onFocus={() => setUnlockPostal(true)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="numeric"
          data-lpignore="true"
          data-1p-ignore="true"
          name={`${fieldId}_postal`}
        />
      </div>
    </div>
  );
}
