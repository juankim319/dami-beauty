"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { NavMenu } from "./NavMenu";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderSearch } from "./HeaderSearch";

export function HeaderClient({ cartOnly }: { cartOnly?: boolean } = {}) {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  void cartOnly;

  return (
    <>
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-5 md:h-14">
        {/* Left: menu */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="group flex items-center gap-2.5 text-dami-500 transition-colors hover:text-dami-900 dark:text-dami-400 dark:hover:text-white"
          aria-label="Menüyü aç"
        >
          <span className="relative flex h-4 w-4 flex-col justify-center">
            <span className="block h-px w-4 bg-current" />
            <span className="mt-[5px] block h-px w-3 bg-current transition-all duration-200 group-hover:w-4" />
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] sm:block">Menu</span>
        </button>

        {/* Center: brand name */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold uppercase tracking-[0.18em] text-dami-900 dark:text-white"
        >
          DAMI BEAUTY
        </Link>

        {/* Right: search + theme + cart */}
        <div className="flex items-center gap-3 md:gap-4">
          <HeaderSearch />
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-dami-500 transition-colors hover:text-dami-900 dark:text-dami-400 dark:hover:text-white"
            aria-label="Sepet"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-dami-900 px-1 text-[9px] font-medium text-white dark:bg-white dark:text-dami-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
