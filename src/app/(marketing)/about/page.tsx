import type { Metadata } from "next";
import Image from "next/image";
import { Compass, GraduationCap, HeartHandshake } from "lucide-react";
import { Button, PageHero, SectionHeading } from "@/components/ui";
import { PhotoPanel } from "@/components/decor";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import NameChangeNotice from "@/components/NameChangeNotice";
import FounderLetter from "@/components/FounderLetter";
import { founderMessage, siteInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Turning Olive Charity",
  description: siteInfo.mission,
};

const values = [
  {
    title: "Empowerment Over Pity",
    icon: HeartHandshake,
    description:
      "We don't just hand things out. We believe true impact comes from helping people build the skills and knowledge to stand on their own feet.",
  },
  {
    title: "Skills, Not Dependency",
    icon: GraduationCap,
    description:
      "The gap between economic security and hardship is often just access to knowledge and skill. We close that gap through hands-on training.",
  },
  {
    title: "Dignity In Every Gift",
    icon: Compass,
    description:
      "Whether it's clothing, food, or a new trade, every act of giving is delivered with dignity, sustainability, and compassion.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`Built on empowerment, not dependency`}
        description={siteInfo.mission}
      />

      <NameChangeNotice className="mx-auto max-w-3xl px-6 pt-14" />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Our Mission" title="Why we exist" />
            <p className="mt-5 leading-relaxed text-olive-700">{siteInfo.mission}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading eyebrow="Our Vision" title="Where we're headed" />
            <p className="mt-5 leading-relaxed text-olive-700">{siteInfo.vision}</p>
          </Reveal>
        </div>
      </section>

      {/* Founder's message */}
      <section className="bg-olive-50/60 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="grid grid-cols-1 gap-10 rounded-[2rem] border border-olive-200/70 bg-cream-50 p-8 shadow-lg shadow-olive-900/5 sm:p-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
              <div className="text-center lg:text-left">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full shadow-lg shadow-olive-900/10 lg:mx-0">
                  <Image
                    src={founderMessage.image}
                    alt={founderMessage.name}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-4 font-serif text-lg font-medium text-olive-950">
                  {founderMessage.name}
                </p>
                <p className="text-sm text-terracotta-600">{founderMessage.role}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-terracotta-600">
                  A Message From Our Founder
                </p>
                <p className="mt-4 text-balance font-serif text-2xl font-medium leading-snug text-olive-950">
                  &ldquo;{founderMessage.pullQuote}&rdquo;
                </p>
                <div className="mt-6">
                  <FounderLetter
                    paragraphs={founderMessage.paragraphs}
                    name={founderMessage.name}
                    role={founderMessage.role}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading eyebrow="What Guides Us" title="Our core values" align="center" />
        </Reveal>
        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <RevealItem key={value.title}>
              <div className="h-full rounded-3xl border border-olive-200/70 bg-cream-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-olive-900/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                  <value.icon size={22} />
                </span>
                <h3 className="mt-6 font-serif text-xl font-medium text-olive-950">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-olive-700">{value.description}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <RevealItem className="relative aspect-[4/5] w-full sm:col-span-2 sm:row-span-2 sm:aspect-auto">
            <PhotoPanel
              src="/images/baking-instructor.jpg"
              alt="Founder leading a baking skills workshop"
              className="blob-mask h-full min-h-[20rem] w-full"
            />
          </RevealItem>
          <RevealItem className="relative aspect-[4/3] w-full">
            <PhotoPanel
              src="/images/team-group-distribution.jpg"
              alt="Turning Olive Charity team at a distribution day"
              className="blob-mask-alt h-full w-full"
            />
          </RevealItem>
          <RevealItem className="relative aspect-[4/3] w-full">
            <PhotoPanel
              src="/images/baking-showcase.jpg"
              alt="Freshly baked bread from a workshop"
              className="blob-mask h-full w-full"
            />
          </RevealItem>
        </RevealGroup>
      </section>

      <Reveal className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="text-balance font-serif text-3xl font-medium text-olive-950 sm:text-4xl">
          Want to see our approach in action?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-olive-700">
          Explore the programs currently running across our partner communities.
        </p>
        <Button href="/programs" className="mt-8">
          Explore Our Programs
        </Button>
      </Reveal>
    </>
  );
}
