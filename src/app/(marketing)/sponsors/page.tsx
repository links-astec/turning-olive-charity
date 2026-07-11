import type { Metadata } from "next";
import { ArrowRight, Handshake } from "lucide-react";
import { Button, PageHero } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { sponsors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsors | Turning Olive Charity",
  description: "Partners and sponsors supporting Turning Olive Charity.",
};

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sponsors"
        title="Our partners in this work"
        description="Every distribution day and workshop is made possible with the support of people and organizations who believe in what we're building."
      />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        {sponsors.length === 0 ? (
          <Reveal>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
              <Handshake size={26} />
            </span>
            <h2 className="mt-6 font-serif text-2xl font-medium text-olive-950">
              We&rsquo;re building our list of partners
            </h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-olive-700">
              We don&rsquo;t have any sponsors to feature just yet — check back soon, or reach out
              if you&rsquo;d like to be one of the first.
            </p>
            <Button href="/contact" className="mt-8">
              Become a Sponsor <ArrowRight size={16} />
            </Button>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex items-center justify-center rounded-2xl border border-olive-200/70 bg-cream-50 p-8"
              >
                <span className="font-serif text-lg text-olive-800">{sponsor.name}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
