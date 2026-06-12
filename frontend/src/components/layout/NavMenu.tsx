"use client";

import Link from "next/link";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: "ABOUT",
    items: [
      { label: "BRAND STORY", href: "/story" },
      { label: "LOOK",        href: "/look" },
    ],
  },
  {
    title: "SHOP",
    items: [
      { label: "ALL",         href: "/products" },
      { label: "GIFT BOX",    href: "/products?type=gift_box" },
      { label: "SET",         href: "/products?type=curation_set" },
      { label: "SINGLE",      href: "/products?type=single" },
      { label: "BEST SELLER", href: "/products?featured=true" },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { label: "NOTICE", href: "/community/notice" },
      { label: "EVENT",  href: "/community/event" },
    ],
  },
  {
    title: "MEMBERSHIP",
    comingSoon: true,
    items: [],
  },
];

export function NavMenu({ open, onClose }: NavMenuProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/50"
        onClick={onClose}
      />

      <div className="fixed left-0 top-0 z-[100] flex h-dvh w-72 flex-col bg-[#FDFAF9] shadow-2xl dark:bg-[#1A0F0E] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] md:w-80">
        <div className="flex shrink-0 items-center justify-between border-b border-dami-200 px-6 py-4 dark:border-dami-800">
          <Link
            href="/"
            onClick={onClose}
            className="text-[12px] font-bold uppercase tracking-[0.2em] text-dami-800 dark:text-white"
          >
            DAMI BEAUTY
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="text-dami-400 transition-colors hover:text-dami-800 dark:text-dami-500 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="nav-menu-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          <div className="space-y-6 pb-4">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-dami-400 dark:text-dami-500">
                  {section.title}
                </p>

                {section.comingSoon ? (
                  <p className="text-[12px] font-medium text-dami-300 dark:text-dami-500">Yakında</p>
                ) : (
                  <ul className="space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-center gap-2.5 px-2 py-2 text-[12px] font-medium uppercase tracking-wide text-dami-700 transition-colors hover:text-dami-900 dark:text-dami-300 dark:hover:text-white"
                        >
                          <span className="inline-block h-px w-0 bg-dami-900 transition-all duration-200 group-hover:w-3 dark:bg-white" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="shrink-0 border-t border-dami-200 px-6 py-3 dark:border-dami-800">
          <p className="text-[10px] uppercase tracking-widest text-dami-400 dark:text-dami-500">
            © {new Date().getFullYear()} Dami Beauty
          </p>
        </div>
      </div>
    </>
  );
}
