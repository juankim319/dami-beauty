"use client";

import { useEffect, useState } from "react";
import { HeaderClient } from "./HeaderClient";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[#FDFAF9]/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-dami-200/90 shadow-[0_4px_24px_rgba(42,20,18,0.06)]"
          : "border-dami-200/80 shadow-none"
      }`}
    >
      <HeaderClient />
    </header>
  );
}
