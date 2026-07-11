import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button, PageHero, ProgramIcon } from "@/components/ui";
import { PhotoPanel } from "@/components/decor";
import { Reveal } from "@/components/motion";
import { programs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs | Turning Olive Charity",
  description: "Explore the programs run by Turning Olive Charity.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Giving that builds toward independence"
        description="We meet immediate needs with clothing and essentials, then go further — teaching real, marketable skills that open doors to financial independence."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="space-y-10">
          {programs.map((program, i) => (
            <Reveal
              key={program.slug}
              delay={i * 0.05}
              className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-olive-200/70 bg-cream-50 p-8 transition-shadow duration-300 hover:shadow-xl hover:shadow-olive-900/10 sm:p-10 lg:grid-cols-[1fr_1.2fr]"
            >
              <PhotoPanel
                src={program.image}
                alt={program.title}
                className={`relative aspect-[4/3] w-full ${
                  i % 2 === 0 ? "blob-mask" : "blob-mask-alt"
                } ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                  <ProgramIcon icon={program.icon} />
                </span>
                <h2 className="mt-6 font-serif text-2xl font-medium text-olive-950">
                  {program.title}
                </h2>
                <p className="mt-4 leading-relaxed text-olive-700">{program.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="text-balance font-serif text-3xl font-medium text-olive-950 sm:text-4xl">
          Help us reach further
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-olive-700">
          Your support directly funds distribution days and skills workshops across our partner
          communities.
        </p>
        <Button href="/contact" className="mt-8">
          Get In Touch <ArrowRight size={16} />
        </Button>
      </Reveal>
    </>
  );
}
