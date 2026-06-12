import Link from "next/link";
import { getMessages } from "@/lib/i18n";

const t = getMessages();

export const metadata = { title: t.look.metaTitle };

export default function LookPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 text-center">
      <p className="section-label mb-3">{t.look.sectionLabel}</p>
      <h1 className="text-lg font-semibold uppercase tracking-wide text-dami-900 dark:text-dami-100">
        {t.look.title}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-dami-500">{t.look.body}</p>
      <Link href="/products?featured=true" className="btn-primary mt-8 inline-block">
        {t.look.cta}
      </Link>
    </section>
  );
}
