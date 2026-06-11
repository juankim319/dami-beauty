import Link from "next/link";

export const metadata = { title: "Look — DAMI BEAUTY" };

export default function LookPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 text-center">
      <p className="section-label mb-3">ABOUT</p>
      <h1 className="text-lg font-semibold uppercase tracking-wide text-dami-900 dark:text-dami-100">LOOK</h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-dami-500">
        Öne çıkan ürünlerimizi ve en çok satanları tanıttığımız lookbook sayfası yakında hazır.
      </p>
      <Link href="/products?featured=true" className="btn-primary mt-8 inline-block">
        En Çok Satanlar
      </Link>
    </section>
  );
}
