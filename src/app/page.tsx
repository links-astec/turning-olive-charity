import { ArrowRight, Quote } from "lucide-react";
import { Button, ProgramIcon, SectionHeading } from "@/components/ui";
import { PhotoPanel, OliveBranch } from "@/components/decor";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import NameChangeNotice from "@/components/NameChangeNotice";
import { blogPosts, founderMessage, programs, siteInfo } from "@/lib/content";

const pillars = [
  { label: "Skills-First", caption: "Our approach" },
  { label: "Dignity", caption: "In every gift" },
  { label: "Community-Led", caption: "How we work" },
  { label: "La, Accra", caption: "Where we're based" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-olive-50 via-cream-100 to-cream-100" />
        <div
          className="absolute -top-24 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-olive-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute top-10 right-0 -z-10 h-80 w-80 rounded-full bg-terracotta-300/25 blur-3xl"
          aria-hidden
        />
        <OliveBranch className="pointer-events-none absolute -top-10 right-10 -z-10 h-[30rem] w-auto text-olive-300/30" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-2">
          <Reveal>
            <h1 className="text-balance font-serif text-4xl font-medium leading-[1.1] text-olive-950 sm:text-5xl lg:text-6xl">
              {siteInfo.tagline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-olive-700">
              {siteInfo.mission}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/programs">
                Explore Our Programs <ArrowRight size={16} />
              </Button>
              <Button href="/contact" variant="ghost">
                Get In Touch
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg">
              <div className="absolute inset-0 animate-float-slow">
                <PhotoPanel
                  src="/images/baking-workshop-hero.png"
                  alt="Children learning to bake at a Turning Olive Charity workshop"
                  priority
                  className="blob-mask h-full w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <NameChangeNotice className="mx-auto max-w-3xl px-6 pb-14" />

      {/* Pillars bar */}
      <section className="relative border-y border-olive-200/60 bg-olive-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.08} className="text-center">
              <p className="font-serif text-2xl font-medium text-cream-50 sm:text-3xl">
                {pillar.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-olive-200">{pillar.caption}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/3] w-full">
            <PhotoPanel
              src="/images/distribution-day.jpg"
              alt="Clothing and essentials distribution day"
              className="blob-mask-alt h-full w-full"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="Our Mission"
              title="Change that takes root, not just relief that passes through."
              description={siteInfo.mission}
            />
            <ul className="mt-8 space-y-4">
              {[
                "Skills and knowledge, not just handouts",
                "Dignity, sustainability, and compassion in every gift",
                "Capacity building toward economic independence",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-olive-800">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button href="/about" variant="secondary" className="mt-9">
              Read Our Story
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-olive-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="What We Do"
              title="Giving that builds toward independence"
              align="center"
            />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {programs.map((program) => (
              <RevealItem key={program.slug}>
                <div className="group h-full rounded-3xl border border-olive-200/70 bg-cream-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-olive-300 hover:shadow-xl hover:shadow-olive-900/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-700 transition-colors duration-300 group-hover:bg-olive-600 group-hover:text-cream-50">
                    <ProgramIcon icon={program.icon} />
                  </span>
                  <h3 className="mt-6 font-serif text-xl font-medium text-olive-950">
                    {program.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-olive-700">{program.summary}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-12 text-center">
            <Button href="/programs" variant="ghost">
              View All Programs <ArrowRight size={16} />
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Founder quote */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Reveal>
          <Quote className="mx-auto text-terracotta-500" size={36} />
          <p className="mt-6 text-balance font-serif text-2xl font-medium leading-relaxed text-olive-950 sm:text-3xl">
            &ldquo;{founderMessage.pullQuote}&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold text-olive-700">
            {founderMessage.name} &mdash; {founderMessage.role}
          </p>
          <Button href="/about" variant="ghost" className="mt-6">
            Read Her Full Message
          </Button>
        </Reveal>
      </section>

      {/* Blog preview */}
      <section className="bg-olive-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Latest Stories" title="News from the field" />
            <Button href="/blog" variant="ghost">
              Read All Stories <ArrowRight size={16} />
            </Button>
          </Reveal>
          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {blogPosts.map((post) => (
              <RevealItem key={post.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-olive-200/70 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-olive-900/10">
                  <PhotoPanel
                    src={post.image}
                    alt={post.title}
                    className="relative aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                      {post.category}
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-medium leading-snug text-olive-950">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-olive-700">
                      {post.excerpt}
                    </p>
                    <time className="mt-5 text-xs text-olive-500">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-olive-900 px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(201,121,63,0.25),transparent_50%)]" />
          <OliveBranch className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-auto text-cream-50/5" />
          <h2 className="relative text-balance font-serif text-3xl font-medium text-cream-50 sm:text-4xl">
            Your generosity plants seeds that grow for generations.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-olive-200">
            Whether it&rsquo;s a donation, volunteering, or partnering — every bit of support
            helps a distribution day or workshop happen.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href="/get-involved">
              Donate Now <ArrowRight size={16} />
            </Button>
            <Button href="/contact" variant="ghost-dark">
              Get In Touch
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
