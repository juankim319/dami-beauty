"use client";

import Link from "next/link";
import { getMessages } from "@/lib/i18n";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
}

export function NavMenu({ open, onClose }: NavMenuProps) {
  const t = getMessages();

  const SECTIONS = [
    {
      title: t.nav.sections.about,
      items: [
        { label: t.nav.links.brandStory, href: "/story" },
        { label: t.nav.links.look, href: "/look" },
      ],
    },
    {
      title: t.nav.sections.shop,
      items: [
        { label: t.nav.links.all, href: "/products" },
        { label: t.nav.links.giftBox, href: "/products?type=gift_box" },
        { label: t.nav.links.set, href: "/products?type=curation_set" },
        { label: t.nav.links.single, href: "/products?type=single" },
        { label: t.nav.links.bestSeller, href: "/products?featured=true" },
      ],
    },
    {
      title: t.nav.sections.community,
      items: [
        { label: t.nav.links.notice, href: "/community/notice" },
        { label: t.nav.links.event, href: "/community/event" },
      ],
    },
    {
      title: t.nav.sections.membership,
      comingSoon: true,
      items: [] as { label: string; href: string }[],
    },
  ];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="fixed left-0 top-0 z-[100] flex h-dvh w-72 flex-col bg-[#FDFAF9] shadow-xl md:w-80">
        <div className="flex shrink-0 items-center justify-between border-b border-dami-200/80 px-6 py-5">
          <Link
            href="/"
            onClick={onClose}
            className="text-[12px] font-semibold uppercase tracking-[0.2em] text-dami-800"
          >
            {t.brand.name}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.search.close}
            className="text-dami-400 transition-colors hover:text-dami-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="nav-menu-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          <div className="space-y-8 pb-4">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.35em] text-dami-400">
                  {section.title}
                </p>

                {section.comingSoon ? (
                  <p className="text-[12px] text-dami-400">{t.nav.comingSoon}</p>
                ) : (
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-center gap-2.5 py-2 text-[12px] font-medium uppercase tracking-wide text-dami-700 transition-colors hover:text-dami-900"
                        >
                          <span className="inline-block h-px w-0 bg-brand transition-all duration-200 group-hover:w-3" />
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

        <div className="shrink-0 border-t border-dami-200/80 px-6 py-4">
          <p className="text-[10px] uppercase tracking-widest text-dami-400">
            © {new Date().getFullYear()} {t.brand.name}
          </p>
        </div>
      </div>
    </>
  );
}
