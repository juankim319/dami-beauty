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
      <div className="relative flex min-h-[35vh] items-end overflow-hidden bg-gradient-to-br from-dami-800 via-dami-900 to-[#3A0B1C] px-5 pb-10 md:px-12 md:pb-14">
        <div>
          <p className="section-label text-dami-200/60">{t.brand.name}</p>
          <h1 className="mt-2 text-xl font-medium text-white md:text-2xl">
            {t.story.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <p className="text-sm leading-relaxed text-dami-700 md:text-base">
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
            className="mx-auto grid max-w-7xl gap-4 border-b border-dami-200 px-5 py-8 md:grid-cols-3 md:py-10"
          >
            <div>
              <p className="section-label">0{i + 1}</p>
              <h2 className="mt-2 text-sm font-medium text-dami-800 md:text-base">
                {s.title}
              </h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs leading-relaxed text-dami-600 md:text-sm">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-14 text-center md:py-20">
        <p className="text-sm text-dami-700 md:text-base">
          {t.brand.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
