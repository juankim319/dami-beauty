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
    <section className="relative flex min-h-[55vh] items-end overflow-hidden md:min-h-[68vh]">
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
          {/* Subtle gradient — photography-first, text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        </>
      ) : (
        /* No banner: warm editorial background */
        <div className="absolute inset-0 bg-gradient-to-br from-dami-100 via-dami-50 to-[#EDE8E0] dark:from-dami-800 dark:via-dami-900 dark:to-dami-900" />
      )}

      <div className="relative z-10 w-full px-6 pb-14 md:px-14 md:pb-20">
        <p className={`mb-3 text-[9px] font-medium uppercase tracking-[0.3em] ${hasBanner ? "text-white/55" : "text-dami-400 dark:text-dami-500"}`}>
          {t.brand.name}
        </p>
        <h1 className={`max-w-lg text-xl font-medium leading-snug tracking-wide md:text-3xl ${hasBanner ? "text-white" : "text-dami-800 dark:text-dami-100"}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-4 max-w-sm text-xs leading-relaxed md:text-sm ${hasBanner ? "text-white/70" : "text-dami-500 dark:text-dami-400"}`}>
            {subtitle}
          </p>
        )}
        <Link
          href="/products"
          className={`mt-8 inline-flex px-6 py-2.5 text-[11px] font-medium uppercase tracking-widest transition-all duration-200 ${
            hasBanner
              ? "border border-white/60 text-white hover:bg-white hover:text-dami-900"
              : "border border-dami-700 text-dami-700 hover:bg-dami-800 hover:border-dami-800 hover:text-white dark:border-dami-400 dark:text-dami-200 dark:hover:bg-dami-700 dark:hover:border-dami-700"
          }`}
        >
          {t.home.shopNow}
        </Link>
      </div>
    </section>
  );
}
