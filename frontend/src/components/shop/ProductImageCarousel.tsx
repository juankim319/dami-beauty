"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImageMagnifier } from "@/components/shop/ProductImageMagnifier";

interface Props {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || images.length <= 1) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(idx, images.length - 1)));
  }, [images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  if (images.length === 0) {
    return (
      <div className="product-img-wrap relative aspect-[3/4] overflow-hidden bg-dami-100 dark:bg-dami-900/40">
        <div className="flex h-full items-center justify-center text-xs text-dami-300">—</div>
      </div>
    );
  }

  if (images.length === 1) {
    return <ProductImageMagnifier src={images[0]} alt={alt} priority />;
  }

  return (
    <div className="space-y-3">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-hidden md:snap-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className="relative w-full shrink-0 snap-center md:w-full"
          >
            <ProductImageMagnifier
              src={src}
              alt={`${alt} ${i + 1}`}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1} / ${images.length}`}
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: i * (scrollRef.current?.clientWidth ?? 0),
                behavior: "smooth",
              });
              setActive(i);
            }}
            className={`h-1 rounded-full transition-all ${
              active === i ? "w-5 bg-dami-800 dark:bg-dami-400" : "w-1.5 bg-dami-300 dark:bg-dami-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
