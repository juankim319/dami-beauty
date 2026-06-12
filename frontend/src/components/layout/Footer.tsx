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

export function Footer() {
  return (
    <footer className="border-t border-[#EDD5CF] bg-gradient-to-b from-[#FBF4F2] via-[#F7EBE8] to-[#F0DDD8]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand + seller info */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="text-[12px] font-semibold uppercase tracking-[0.25em] text-dami-800"
            >
              {t.brand.name}
            </Link>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-dami-500">
              {t.brand.tagline}
            </p>
            <div className="mt-6 space-y-1 text-[11px] leading-relaxed text-dami-500/90">
              <p><span className="text-dami-400">{t.footer.unvan}:</span> {SELLER_NAME}</p>
              <p><span className="text-dami-400">{t.footer.vkn}:</span> {SELLER_VKN}</p>
              <p><span className="text-dami-400">{t.footer.address}:</span> {CONTACT_ADDRESS}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.35em] text-dami-400">
              {t.footer.contact}
            </p>
            <ul className="space-y-2.5 text-[12px] text-dami-600">
              <li>
                <a href={`tel:+${CONTACT_PHONE_RAW}`} className="transition-colors hover:text-dami-900">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="break-all transition-colors hover:text-dami-900">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/damibeautyy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-dami-900"
                >
                  @damibeautyy
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="md:col-span-4 md:pl-8">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.35em] text-dami-400">
              {t.nav.explore}
            </p>
            <ul className="space-y-2 text-[12px] text-dami-600">
              <li><Link href="/products" className="transition-colors hover:text-dami-900">{t.nav.products}</Link></li>
              <li><Link href="/story" className="transition-colors hover:text-dami-900">{t.nav.story}</Link></li>
            </ul>
            <p className="mb-4 mt-8 text-[9px] font-medium uppercase tracking-[0.35em] text-dami-400">
              {t.legal.footerLegal}
            </p>
            <ul className="space-y-2 text-[12px] text-dami-600">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-dami-900">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#EDD5CF]/80 pt-8 text-center">
          <p className="text-[10px] tracking-[0.2em] text-dami-400">
            {t.footer.rights(new Date().getFullYear())}
          </p>
        </div>
      </div>
    </footer>
  );
}
