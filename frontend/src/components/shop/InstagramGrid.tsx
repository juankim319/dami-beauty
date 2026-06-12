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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="section-title">{t.brand.instagram}</h2>
        <a
          href="https://www.instagram.com/damibeautyy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-dami-500 hover:underline"
        >
          {t.home.followInstagram}
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={post.image_url}
              alt={t.brand.instagram}
              fill
              className="object-cover transition hover:scale-105"
              sizes="33vw"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
