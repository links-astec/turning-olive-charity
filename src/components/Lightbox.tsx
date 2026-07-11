"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/content";

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = index !== null;
  const current = open ? images[index] : null;
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-olive-950"
          onClick={onClose}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-cream-50/20 sm:right-6 sm:top-6"
          >
            <X size={22} />
          </button>

          <p className="absolute left-4 top-5 z-10 text-sm font-medium text-cream-50/70 sm:left-6">
            {index !== null ? index + 1 : 0} / {images.length}
          </p>

          <div className="relative flex flex-1 items-center justify-center p-4 pb-2 sm:p-8 sm:pb-2">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-cream-50/20 sm:left-6"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-cream-50/20 sm:right-6"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-4 pt-2 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((image, i) => (
              <button
                key={image.src}
                ref={i === index ? activeThumbRef : undefined}
                type="button"
                onClick={() => onNavigate(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all sm:h-16 sm:w-24 ${
                  i === index
                    ? "opacity-100 ring-2 ring-cream-50"
                    : "opacity-40 hover:opacity-75"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
