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
}

export function AddressCombobox({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
}: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = filterOptions(options, query);
  const showList = open && !disabled && filtered.length > 0;

  const select = (opt: string) => {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  };

  const commit = () => {
    const trimmed = query.trim();
    if (trimmed) onChange(trimmed);
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
      <input
        id={id}
        type="text"
        className="input-field"
        value={query}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
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
      {showList && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-lg">
          {filtered.map((opt, i) => (
            <li key={opt}>
              <button
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm ${
                  i === highlight ? "bg-dami-50 text-dami-900" : "text-gray-800 hover:bg-gray-50"
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
      {options.length === 0 && query && (
        <p className="mt-1 text-[10px] text-gray-400">Listede yoksa doğrudan yazın.</p>
      )}
    </div>
  );
}
