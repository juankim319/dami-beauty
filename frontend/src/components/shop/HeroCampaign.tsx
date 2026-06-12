import Link from "next/link";
import Image from "next/image";
import type { Campaign } from "@/types";
import { getMessages } from "@/lib/i18n";

interface HeroCampaignProps {
  campaign: Campaign | null;
}

export function HeroCampaign({ campaign }: HeroCampaignProps) {
  const t = getMessages();
  const title    = campaign?.title_tr    || t.home.heroTitleDefault;
  const subtitle = campaign?.subtitle_tr || t.home.heroSubtitleDefault;
  const hasBanner = !!campaign?.banner_url;

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {hasBanner ? (
        <>
          <Image
            src={campaign!.banner_url!}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Minimal bottom-gradient — photography first */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Text — bottom left, hince-style */}
          <div className="relative z-10 mt-auto w-full px-6 pb-16 md:px-12 md:pb-20">
            <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.35em] text-white/50">
              {t.brand.name}
            </p>
            <h1 className="max-w-md text-xl font-light tracking-wide text-white md:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/65 md:text-sm">
                {subtitle}
              </p>
            )}
            <Link
              href="/products"
              className="mt-8 inline-flex border border-white/60 px-7 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-dami-900"
            >
              {t.home.shopNow}
            </Link>
          </div>
        </>
      ) : (
        /* No banner — clean full-screen editorial placeholder, hince-style */
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-dami-100 via-[#F2E4E0] to-dami-200 dark:from-dami-800 dark:via-dami-900 dark:to-dami-900" />
          {/* Centered content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.45em] text-dami-400 dark:text-dami-500">
              {t.home.newCollection}
            </p>
            <h1 className="text-3xl font-extralight tracking-[0.4em] text-dami-800 dark:text-dami-100 md:text-5xl">
              {t.brand.name}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-xs text-xs leading-relaxed text-dami-400 dark:text-dami-500 md:text-sm">
                {subtitle}
              </p>
            )}
            <Link
              href="/products"
              className="mt-10 inline-flex border border-dami-800 px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-dami-800 transition-colors hover:bg-dami-900 hover:border-dami-900 hover:text-white dark:border-dami-300 dark:text-dami-200 dark:hover:bg-white dark:hover:border-white dark:hover:text-dami-900"
            >
              {t.home.shopNow}
            </Link>
          </div>
          {/* Scroll indicator */}
          <div className="relative z-10 flex justify-center pb-10">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-dami-400 dark:text-dami-600">{t.home.scrollHint}</span>
              <div className="h-6 w-px bg-dami-300 dark:bg-dami-600" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
