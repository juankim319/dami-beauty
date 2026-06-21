import Image from "next/image";
import type { InstagramPost } from "@/types";
import { getMessages } from "@/lib/i18n";

interface InstagramGridProps {
  posts: InstagramPost[];
}

export function InstagramGrid({ posts }: InstagramGridProps) {
  const t = getMessages();

  return (
    <section className="py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="section-label">{t.brand.name}</p>
          <h2 className="mt-1 section-title">{t.brand.instagram}</h2>
        </div>
        <a
          href="https://www.instagram.com/damibeautyy/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-dash"
        >
          {t.home.followInstagram}
        </a>
      </div>
      <div className="grid grid-cols-3 gap-1.5 md:gap-2">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-dami-100"
          >
            <Image
              src={post.image_url}
              alt={t.brand.instagram}
              fill
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-dami-900/0 transition-colors duration-300 group-hover:bg-dami-900/20">
              <svg
                className="h-5 w-5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.25}
                aria-hidden
              >
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                <circle cx="12" cy="12" r="3.75" />
                <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
