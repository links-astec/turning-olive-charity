"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import type { GalleryImage } from "@/lib/content";

const BATCH_SIZE = 30;

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, images.length));
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => Math.min(v + BATCH_SIZE, images.length));
        }
      },
      { rootMargin: "700px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [images.length]);

  const visible = images.slice(0, visibleCount);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {visible.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative mb-3 block w-full break-inside-avoid rounded-xl border border-olive-200/70 bg-cream-50 p-1.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:mb-4 sm:p-2"
          >
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={image.src}
                alt={image.alt}
                width={500}
                height={375}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="w-full grayscale-[35%] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-olive-950/0 transition-colors duration-300 group-hover:bg-olive-950/20">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/0 text-cream-50 opacity-0 transition-all duration-300 group-hover:bg-cream-50/15 group-hover:opacity-100 group-hover:backdrop-blur-sm">
                  <Maximize2 size={16} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {visibleCount < images.length && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          <div className="h-2 w-2 animate-pulse rounded-full bg-olive-300" />
        </div>
      )}

      <p className="mt-6 text-center text-sm text-olive-500">
        Showing {Math.min(visibleCount, images.length)} of {images.length} photos
      </p>

      <Lightbox
        images={images}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
