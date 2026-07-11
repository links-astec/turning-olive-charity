"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Maximize2 } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import type { GalleryImage } from "@/lib/content";

const AUTO_ADVANCE_MS = 4500;

export default function FeaturedShowcase({
  items,
  allImages,
  eyebrow,
  title,
  description,
  scrollTargetId,
}: {
  items: { image: GalleryImage; originalIndex: number }[];
  allImages: GalleryImage[];
  eyebrow: string;
  title: string;
  description: string;
  scrollTargetId: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const mobileThumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((v) => (v + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, items.length]);

  useEffect(() => {
    mobileThumbRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const select = (i: number) => setActive(i);

  const scrollToGrid = () => {
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[calc(100dvh-4rem)] w-full overflow-hidden bg-olive-950"
    >
      <div className="absolute inset-0">
        {items.map((item, i) => (
          <div
            key={item.image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-olive-950/90 via-olive-950/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-olive-950/90 to-transparent" />

      <div className="absolute inset-x-0 top-0 px-6 pt-10 text-center sm:pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta-300 sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance font-serif text-4xl font-medium text-cream-50 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-cream-100/85 sm:text-base sm:text-cream-100/80">
          {description}
        </p>
      </div>

      {/* Desktop: vertical arc rail on the right */}
      <div className="absolute inset-y-0 right-6 hidden items-center lg:flex">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-olive-950/30 p-3 backdrop-blur-md">
          {items.map((item, i) => {
            const distance = i - active;
            const abs = Math.abs(distance);
            const translateX = -Math.max(0, 26 - abs * 11);
            const scale = Math.max(0.6, 1 - abs * 0.13);
            const opacity = Math.max(0.35, 1 - abs * 0.16);
            return (
              <motion.button
                key={item.image.src}
                type="button"
                onClick={() => select(i)}
                animate={{ x: translateX, scale, opacity }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ${
                  i === active ? "ring-2 ring-terracotta-400" : ""
                }`}
                aria-label={`Show photo ${i + 1}`}
              >
                <Image src={item.image.src} alt="" fill sizes="80px" className="object-cover" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile: horizontal filmstrip */}
      <div className="absolute inset-x-0 bottom-16 flex gap-2 overflow-x-auto px-4 lg:hidden">
        {items.map((item, i) => (
          <button
            key={item.image.src}
            ref={(el) => {
              mobileThumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => select(i)}
            className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg transition-all ${
              i === active ? "opacity-100 ring-2 ring-terracotta-400" : "opacity-45"
            }`}
          >
            <Image src={item.image.src} alt="" fill sizes="60px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-8 flex items-center justify-between px-5 sm:px-8 lg:bottom-10">
        <button
          type="button"
          onClick={() => setLightboxIndex(items[active].originalIndex)}
          className="flex items-center gap-2 rounded-full bg-cream-50/10 px-3.5 py-2 text-xs font-medium text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/20 sm:px-4 sm:text-sm"
        >
          <Maximize2 size={14} /> View full size
        </button>
        <span className="text-xs font-medium text-cream-50/70 sm:text-sm">
          {active + 1} / {items.length}
        </span>
      </div>

      <button
        type="button"
        onClick={scrollToGrid}
        className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-0.5 text-cream-50/70 transition-colors hover:text-cream-50"
      >
        <span className="text-[11px] font-medium">See all {allImages.length} photos</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>

      <Lightbox
        images={allImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
