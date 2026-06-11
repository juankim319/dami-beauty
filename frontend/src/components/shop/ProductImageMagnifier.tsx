"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

const LENS = 128;
const ZOOM = 2.5;

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

export function ProductImageMagnifier({
  src,
  alt,
  priority = false,
  sizes = "(max-width:768px) 100vw, 50vw",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [lens, setLens] = useState({ left: 0, top: 0, bgX: 50, bgY: 50 });

  const measure = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    setDims({ w: el.clientWidth, h: el.clientHeight });
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = Math.max(0, Math.min(x - LENS / 2, rect.width - LENS));
    const top = Math.max(0, Math.min(y - LENS / 2, rect.height - LENS));
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setLens({ left, top, bgX, bgY });
  };

  return (
    <div
      ref={wrapRef}
      className="product-img-wrap group/zoom relative aspect-[3/4] overflow-hidden bg-dami-100 dark:bg-dami-900/40"
      onMouseEnter={() => {
        measure();
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 md:group-hover/zoom:scale-[1.02]"
        priority={priority}
        sizes={sizes}
        draggable={false}
      />

      {/* Desktop / tablet magnifier lens */}
      <div
        aria-hidden
        className={`pointer-events-none absolute z-10 hidden overflow-hidden rounded-full border-2 border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-opacity duration-200 md:block ${
          hovering && dims.w > 0 ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: LENS,
          height: LENS,
          left: lens.left,
          top: lens.top,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${dims.w * ZOOM}px ${dims.h * ZOOM}px`,
          backgroundPosition: `${lens.bgX}% ${lens.bgY}%`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/zoom:opacity-100 md:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M16 16l4.5 4.5" />
          <path strokeLinecap="round" d="M11 8v6M8 11h6" />
        </svg>
        Zoom
      </div>
    </div>
  );
}
