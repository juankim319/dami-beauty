import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_RAW,
  SELLER_NAME,
  SELLER_VKN,
} from "@/lib/contact";

const t = getMessages();

const LEGAL_LINKS = [
  { href: "/legal/gizlilik",       label: t.legal.footerPrivacy  },
  { href: "/legal/mesafeli-satis", label: t.legal.footerDistance },
  { href: "/legal/iade-degisim",   label: t.legal.footerReturns  },
  { href: "/legal/cerez",          label: t.legal.footerCookies  },
];

function IconPhone({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5C3 4.12 4.12 3 5.5 3h1.75c.69 0 1.31.42 1.57 1.06l.82 1.87a1.75 1.75 0 01-.41 1.94l-.96.96a12.04 12.04 0 005.77 5.77l.96-.96a1.75 1.75 0 011.94-.41l1.87.82c.64.26 1.06.88 1.06 1.57V18.5A1.5 1.5 0 0117.5 20 15 15 0 013 5.5z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l7 5 7-5" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-dami-200 bg-dami-900 dark:border-dami-700">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white">
              {t.brand.name}
            </Link>
            <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-dami-400">
              {t.brand.tagline}
            </p>
            <div className="mt-5 space-y-1.5 text-[10px] leading-relaxed text-dami-500">
              <p><span className="text-dami-400">Unvan:</span> {SELLER_NAME}</p>
              <p><span className="text-dami-400">VKN:</span> {SELLER_VKN}</p>
              <p><span className="text-dami-400">Adres:</span> {CONTACT_ADDRESS}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-dami-500">{t.footer.contact}</p>
            <ul className="mt-4 space-y-3 text-xs text-dami-400">
              <li>
                <a
                  href={`tel:+${CONTACT_PHONE_RAW}`}
                  className="group flex items-center gap-2.5 underline-offset-4 hover:text-white hover:underline transition-colors"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dami-700 text-dami-500 transition-colors group-hover:border-dami-500 group-hover:text-white">
                    <IconPhone className="h-3.5 w-3.5" />
                  </span>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group flex items-start gap-2.5 break-all underline-offset-4 hover:text-white hover:underline transition-colors"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dami-700 text-dami-500 transition-colors group-hover:border-dami-500 group-hover:text-white">
                    <IconMail className="h-3.5 w-3.5" />
                  </span>
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/damibeautyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 underline-offset-4 hover:text-white hover:underline transition-colors"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dami-700 text-dami-500 transition-colors group-hover:border-dami-500 group-hover:text-white">
                    <IconInstagram className="h-3.5 w-3.5" />
                  </span>
                  @damibeautyy
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-dami-500">{t.nav.explore}</p>
            <ul className="mt-4 space-y-2 text-xs text-dami-400">
              <li>
                <Link href="/products" className="underline-offset-4 hover:text-white hover:underline transition-colors">{t.nav.products}</Link>
              </li>
              <li>
                <Link href="/story" className="underline-offset-4 hover:text-white hover:underline transition-colors">{t.nav.story}</Link>
              </li>
            </ul>
            <p className="mt-6 text-[10px] font-medium uppercase tracking-widest text-dami-500">{t.legal.footerLegal}</p>
            <ul className="mt-4 space-y-2 text-xs text-dami-400">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-offset-4 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-dami-800 pt-6 text-center">
          <p className="text-[10px] text-dami-600">{t.footer.rights(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}
