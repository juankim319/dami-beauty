import { getMessages } from "@/lib/i18n";

const t = getMessages();

export const metadata = { title: t.community.event.metaTitle };

export default function EventPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <p className="section-label mb-3">{t.community.sectionLabel}</p>
      <h1 className="text-lg font-semibold uppercase tracking-wide text-dami-900 dark:text-dami-100">
        {t.community.event.title}
      </h1>
      <p className="mt-4 text-sm text-dami-500">{t.community.event.preparing}</p>
      <div className="mt-10 divide-y divide-dami-100 border-t border-dami-200 dark:divide-dami-800 dark:border-dami-800">
        <div className="py-6 text-center text-sm text-dami-400">{t.community.event.empty}</div>
      </div>
    </section>
  );
}
