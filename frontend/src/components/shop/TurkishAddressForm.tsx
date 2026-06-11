"use client";

import { AddressCombobox } from "./AddressCombobox";
import {
  PROVINCES,
  buildFullAddress,
  getDistricts,
  getNeighborhoods,
  getStreets,
  type AddressParts,
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
  const districts = getDistricts(value.il);
  const neighborhoods = getNeighborhoods(value.il, value.ilce);
  const streets = getStreets(value.il, value.ilce, value.mahalle);

  const update = (patch: Partial<AddressParts>) => {
    const next: AddressParts = { ...value, ...patch };

    // Reset dependent fields when parent changes
    if (patch.il !== undefined && patch.il !== value.il) {
      next.ilce = "";
      next.mahalle = "";
      next.street = "";
    }
    if (patch.ilce !== undefined && patch.ilce !== value.ilce) {
      next.mahalle = "";
      next.street = "";
    }
    if (patch.mahalle !== undefined && patch.mahalle !== value.mahalle) {
      next.street = "";
    }

    onChange(withLine(next));
  };

  return (
    <div className="space-y-3">
      <AddressCombobox
        label="İl"
        value={value.il}
        onChange={(il) => update({ il })}
        options={[...PROVINCES]}
        placeholder="İstanbul"
        required
      />

      <AddressCombobox
        label="İlçe"
        value={value.ilce}
        onChange={(ilce) => update({ ilce })}
        options={districts}
        placeholder="Bağcılar"
        required
        disabled={!value.il}
      />

      <AddressCombobox
        label="Mahalle"
        value={value.mahalle}
        onChange={(mahalle) => update({ mahalle })}
        options={neighborhoods}
        placeholder="Güneşli"
        required
        disabled={!value.ilce}
      />

      <AddressCombobox
        label="Cadde / Sokak"
        value={value.street}
        onChange={(street) => update({ street })}
        options={streets}
        placeholder="1240. Sokak"
        required
        disabled={!value.mahalle}
      />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="section-label mb-1 block">Kapı No *</label>
          <input
            className="input-field"
            placeholder="4"
            value={value.building_no}
            onChange={(e) => update({ building_no: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="section-label mb-1 block">Kat</label>
          <input
            className="input-field"
            placeholder="2"
            value={value.floor}
            onChange={(e) => update({ floor: e.target.value })}
          />
        </div>
        <div>
          <label className="section-label mb-1 block">Daire</label>
          <input
            className="input-field"
            placeholder="3"
            value={value.apartment}
            onChange={(e) => update({ apartment: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="section-label mb-1 block">Posta Kodu (İsteğe Bağlı)</label>
        <input
          className="input-field"
          placeholder="34212"
          value={value.postal_code ?? ""}
          onChange={(e) => update({ postal_code: e.target.value })}
        />
      </div>

      {value.address_line && (
        <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tam Adres</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-700">{value.address_line}</p>
        </div>
      )}
    </div>
  );
}
