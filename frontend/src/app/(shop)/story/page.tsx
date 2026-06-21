import type { Metadata } from "next";
import Link from "next/link";
import { getMessages } from "@/lib/i18n";

const t = getMessages();

export const metadata: Metadata = {
  title: t.story.title,
  description: t.story.metaDescription,
};

export default function StoryPage() {
  return (
    <article>
      <div className="relative flex min-h-[45vh] items-end overflow-hidden bg-gradient-to-br from-[#FEF8F7] via-[#FDF1EF] to-[#FCE9E6] px-5 pb-12 md:px-12 md:pb-16">
        <div className="animate-fade-in-up">
          <p className="section-label">{t.brand.name}</p>
          <h1 className="mt-3 text-2xl font-extralight uppercase tracking-[0.25em] text-dami-800 md:text-4xl">
            {t.story.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12 md:py-16 animate-fade-in-up animate-fade-in-up-delay-1">
        <p className="text-center text-sm leading-relaxed text-dami-600 md:text-base md:leading-loose">
          {t.story.intro}
        </p>
      </div>

      <div className="border-t border-dami-200">
        {[
          { title: t.story.section1Title, body: t.story.section1Body },
          { title: t.story.section2Title, body: t.story.section2Body },
          { title: t.story.section3Title, body: t.story.section3Body },
        ].map((s, i) => (
          <div
            key={i}
            className="mx-auto grid max-w-7xl gap-4 border-b border-dami-200 px-5 py-10 transition-colors duration-200 hover:bg-dami-50/30 md:grid-cols-3 md:py-14"
          >
            <div className="border-l-2 border-brand/25 pl-4 md:pl-5">
              <p className="section-label">0{i + 1}</p>
              <h2 className="mt-2 text-sm font-medium uppercase tracking-wide text-dami-800 md:text-base">
                {s.title}
              </h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs leading-relaxed text-dami-600 md:text-sm md:leading-loose">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dami-100 bg-gradient-to-b from-transparent to-[#FEF8F7] px-5 py-16 text-center md:py-24">
        <p className="text-sm font-light tracking-wide text-dami-700 md:text-base">
          {t.brand.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="btn-primary">{t.story.exploreSets}</Link>
          <a
            href="https://www.instagram.com/damibeautyy/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {t.story.followInstagram}
          </a>
        </div>
      </div>
    </article>
  );
}
