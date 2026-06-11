"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { getMessages } from "@/lib/i18n";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = getMessages();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t.theme.switchLight : t.theme.switchDark}
      className="flex h-8 w-8 items-center justify-center rounded-full text-dami-100/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[17px] w-[17px]" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[17px] w-[17px]" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
