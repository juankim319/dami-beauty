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
    <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-dami-900 md:min-h-[65vh]">
      {hasBanner ? (
        <>
          <Image
            src={campaign!.banner_url!}
            alt={title}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dami-900 via-dami-900/70 to-dami-800/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-dami-800 via-dami-900 to-[#3A0B1C]" />
      )}

      <div className="relative z-10 w-full px-5 pb-12 md:px-12 md:pb-16">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-dami-200/60">
          {t.brand.name}
        </p>
        <h1 className="max-w-xl text-xl font-medium leading-snug text-white md:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-dami-100/70 md:text-sm">
            {subtitle}
          </p>
        )}
        <Link
          href="/products"
          className="mt-6 inline-flex border border-dami-200/50 px-5 py-2 text-[11px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-dami-900"
        >
          {t.home.shopNow}
        </Link>
      </div>
    </section>
  );
}
