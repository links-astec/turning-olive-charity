import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { RevealGroup, RevealItem } from "@/components/motion";
import { board } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Board | Turning Olive Charity",
  description: "Meet the board behind Turning Olive Charity.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Board"
        title="The people behind the work"
        description="A small board guiding Turning Olive Charity's programs and partnerships."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {board.map((member) => (
            <RevealItem key={member.name} className="group text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-olive-400 via-olive-500 to-olive-700 font-serif text-2xl font-medium text-cream-50 shadow-lg shadow-olive-900/10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {member.initials}
              </div>
              <h3 className="mt-5 font-serif text-lg font-medium text-olive-950">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-terracotta-600">{member.role}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
