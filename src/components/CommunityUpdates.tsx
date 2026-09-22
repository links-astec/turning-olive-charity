"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Download, X } from "lucide-react";
import { Button, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/motion";
import type { CommunityUpdate } from "@/lib/content";

function StatusBadge({ status }: { status: CommunityUpdate["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        status === "current"
          ? "bg-terracotta-500 text-cream-50"
          : "bg-olive-100 text-olive-700"
      }`}
    >
      {status === "current" ? "Current" : "Past"}
    </span>
  );
}

function typeLabel(type: CommunityUpdate["type"]): string {
  if (type === "flyer") return "Flyer";
  if (type === "announcement") return "Announcement";
  return "Donation";
}

/** Every item here is a dense, portrait-oriented document — cropping it to a landscape
 * frame would cut off the text that makes it useful, so the full page is always shown. */
function UpdateMedia({ update }: { update: CommunityUpdate }) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-200">
      <Image
        src={update.image}
        alt={update.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-contain transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

function UpdateCard({ update, onOpen }: { update: CommunityUpdate; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-olive-200/70 bg-cream-50 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-olive-900/10"
    >
      <UpdateMedia update={update} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <StatusBadge status={update.status} />
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
            {typeLabel(update.type)}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-lg font-medium leading-snug text-olive-950">
          {update.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-olive-700">{update.description}</p>
        <time className="mt-4 text-xs text-olive-500">
          {new Date(update.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
    </button>
  );
}

/** Full-size viewer for a flyer/announcement, with a download link. */
function UpdateViewer({ update, onClose }: { update: CommunityUpdate | null; onClose: () => void }) {
  useEffect(() => {
    if (!update) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [update, onClose]);

  return (
    <AnimatePresence>
      {update && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-olive-950/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={update.status} />
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-300">
                {typeLabel(update.type)}
              </span>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <a
                href={update.image}
                download
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/10 px-3.5 py-2 text-xs font-medium text-cream-50 backdrop-blur-sm transition-colors hover:bg-cream-50/20"
              >
                <Download size={14} /> Download
              </a>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-cream-50/20"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-10 sm:px-6 lg:flex-row lg:items-start">
            <div
              className="relative mx-auto flex w-full flex-1 items-start justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={update.image}
                alt={update.title}
                className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
            <div
              className="mx-auto w-full max-w-md shrink-0 rounded-2xl bg-cream-50 p-6 lg:sticky lg:top-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-serif text-xl font-medium text-olive-950">{update.title}</h2>
              <time className="mt-1 block text-xs text-olive-500">
                {new Date(update.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <p className="mt-4 leading-relaxed text-olive-700">{update.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Homepage teaser — a few recent items with a link through to the full catalogue on /programs. */
export function CommunityUpdatesTeaser({ updates }: { updates: CommunityUpdate[] }) {
  const items = updates.slice(0, 3);
  const [viewing, setViewing] = useState<CommunityUpdate | null>(null);

  return (
    <section className="bg-olive-50/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Donations & Announcements" title="Flyers, updates, and giving on record" />
          <Button href="/programs#updates" variant="ghost">
            View Full Catalogue <ArrowRight size={16} />
          </Button>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((update) => (
            <UpdateCard key={update.slug} update={update} onOpen={() => setViewing(update)} />
          ))}
        </Reveal>
      </div>
      <UpdateViewer update={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}

type Filter = "all" | "flyer" | "announcement" | "past";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "flyer", label: "Flyers" },
  { value: "announcement", label: "Announcements" },
  { value: "past", label: "Past Donations" },
];

/** Full catalogue — filterable, for the Programs page. */
export function CommunityUpdatesCatalogue({ updates }: { updates: CommunityUpdate[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [viewing, setViewing] = useState<CommunityUpdate | null>(null);
  const visible = updates.filter((u) => {
    if (filter === "all") return true;
    if (filter === "past") return u.status === "past";
    return u.type === filter;
  });

  return (
    <section id="updates" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Donations & Announcements"
          title="Our giving catalogue"
          description="A running record of past donations and workshops, plus flyers and announcements for what's coming up next."
          align="center"
        />
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.value
                ? "bg-olive-800 text-cream-50"
                : "bg-olive-100 text-olive-700 hover:bg-olive-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </Reveal>

      {visible.length === 0 ? (
        <p className="mt-14 text-center text-olive-500">Nothing to show in this category yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((update) => (
              <motion.div
                key={update.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <UpdateCard update={update} onOpen={() => setViewing(update)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <UpdateViewer update={viewing} onClose={() => setViewing(null)} />
    </section>
  );
}
