import { getMessages } from "@/lib/i18n";

const t = getMessages();

export const metadata = { title: t.community.notice.metaTitle };

export default function NoticePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <p className="section-label mb-3">{t.community.sectionLabel}</p>
      <h1 className="text-lg font-semibold uppercase tracking-wide text-dami-900 dark:text-dami-100">
        {t.community.notice.title}
      </h1>
      <p className="mt-4 text-sm text-dami-500">{t.community.notice.preparing}</p>
      <div className="mt-10 divide-y divide-dami-100 border-t border-dami-200 dark:divide-dami-800 dark:border-dami-800">
        {t.community.notice.items.map((title, i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <span className="text-sm font-medium text-dami-800 dark:text-dami-200">{title}</span>
            <span className="text-[11px] text-dami-400">2025.01.01</span>
          </div>
        ))}
      </div>
    </section>
  );
}
