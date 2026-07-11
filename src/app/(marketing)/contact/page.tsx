import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { PhotoPanel } from "@/components/decor";
import { Reveal } from "@/components/motion";
import { siteInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | Turning Olive Charity",
  description: "Get in touch with Turning Olive Charity.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about a program, partnership ideas, or press inquiries — reach out and our team will get back to you soon."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="relative aspect-[4/3] w-full">
            <PhotoPanel
              src="/images/team-with-child.jpg"
              alt="A Turning Olive Charity volunteer with a child"
              className="blob-mask-alt h-full w-full"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-2xl font-medium text-olive-950">
              Reach us directly
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-olive-700">
              No forms to fill out — just email or call, and we&rsquo;ll get back to you as soon
              as we can.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${siteInfo.email}`}
                className="flex items-center gap-4 rounded-2xl border border-olive-200/70 bg-cream-50 p-6 shadow-lg shadow-olive-900/5 transition-all hover:-translate-y-0.5 hover:border-terracotta-400 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                  <Mail size={22} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                    Email
                  </span>
                  <span className="block font-serif text-lg font-medium text-olive-950">
                    {siteInfo.email}
                  </span>
                </span>
              </a>

              <a
                href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-4 rounded-2xl border border-olive-200/70 bg-cream-50 p-6 shadow-lg shadow-olive-900/5 transition-all hover:-translate-y-0.5 hover:border-terracotta-400 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                  <Phone size={22} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                    Call
                  </span>
                  <span className="block font-serif text-lg font-medium text-olive-950">
                    {siteInfo.phone}
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-4 p-6 text-olive-700">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                  <MapPin size={22} />
                </span>
                <span>{siteInfo.location}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
