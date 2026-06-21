"use client";

import { useEffect, useId, useRef, useState } from "react";
import { filterOptions } from "@/lib/turkish-address";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  strict?: boolean;
  emptyHint?: string;
  inputName?: string;
}

export function AddressCombobox({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  loading,
  strict,
  emptyHint,
  inputName,
}: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [blockAutofill, setBlockAutofill] = useState(true);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = filterOptions(options, query, strict ? 150 : 500);
  const showList = open && !disabled && !loading && filtered.length > 0;

  const select = (opt: string) => {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  };

  const commit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      onChange("");
      setOpen(false);
      return;
    }

    if (strict) {
      const exact = options.find(
        (o) => o.toLocaleLowerCase("tr-TR") === trimmed.toLocaleLowerCase("tr-TR"),
      );
      if (exact) {
        onChange(exact);
        setQuery(exact);
      } else {
        setQuery(value);
      }
    } else if (trimmed) {
      onChange(trimmed);
    }
    setOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={id} className="section-label mb-1 block">
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          name={inputName ?? `addr_${id}`}
          className="input-field"
          value={query}
          placeholder={loading ? "Yükleniyor…" : placeholder}
          required={required}
          disabled={disabled || loading}
          readOnly={blockAutofill}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
            if (!strict) onChange(e.target.value);
          }}
          onFocus={() => {
            setBlockAutofill(false);
            if (!disabled && !loading) setOpen(true);
          }}
          onBlur={() => setTimeout(commit, 120)}
          onKeyDown={(e) => {
            if (!showList) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter" && filtered[highlight]) {
              e.preventDefault();
              select(filtered[highlight]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {loading && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-dami-200 border-t-dami-700" />
          </span>
        )}
      </div>
      {showList && (
        <ul className="absolute z-[210] mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-dami-200 bg-white py-1 shadow-lg md:max-h-48 md:rounded md:z-50">
          {filtered.map((opt, i) => (
            <li key={opt}>
              <button
                type="button"
                className={`block w-full px-4 py-3 text-left text-base md:px-3 md:py-2 md:text-sm ${
                  i === highlight ? "bg-dami-50 text-dami-900" : "text-dami-800 hover:bg-dami-50/60"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(opt);
                }}
                onMouseEnter={() => setHighlight(i)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && !disabled && options.length === 0 && emptyHint && (
        <p className="mt-1 text-[10px] text-dami-400">{emptyHint}</p>
      )}
    </div>
  );
}
