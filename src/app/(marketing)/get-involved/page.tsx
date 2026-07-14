import type { Metadata } from "next";
import { Banknote, HandHeart, Handshake, Smartphone, Sprout } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui";
import CopyField from "@/components/CopyField";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { donationInfo, siteInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get Involved | Turning Olive Charity",
  description: "Donate, volunteer, or partner with Turning Olive Charity.",
};

const ways = [
  {
    title: "Volunteer",
    icon: HandHeart,
    description: "Join a program on the ground or contribute remote skills like design, writing, or logistics.",
  },
  {
    title: "Partner",
    icon: Handshake,
    description: "Businesses and organizations can sponsor a program or co-fund a community initiative.",
  },
  {
    title: "Fundraise",
    icon: Sprout,
    description: "Start a fundraiser for your birthday, event, or community group and grow our impact together.",
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Every seed of support helps something lasting grow"
        description="Whether you give, volunteer, or partner with us, your contribution goes directly toward community-led programs."
      />

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Make a Donation"
              title="Give directly via Mobile Money"
              description="We're setting up online payments — for now, you can send your gift directly using the details below."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Registered charity — GL-003-7942",
                "Every gift funds a distribution day or a seat in a skills workshop",
                "Let us know after sending, so we can confirm and say thank you",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-olive-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4 rounded-3xl border border-olive-200/70 bg-cream-50 p-8 shadow-lg shadow-olive-900/5">
              {donationInfo.momoAccounts.map((account) => (
                <div key={account.network}>
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                    <Smartphone size={14} /> {account.network}
                  </span>
                  <CopyField value={account.number} />
                </div>
              ))}

              <div>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                  <Banknote size={14} /> Bank Transfer
                </span>
                {donationInfo.bankAccount ? (
                  <CopyField value={donationInfo.bankAccount} />
                ) : (
                  <div className="rounded-xl border border-dashed border-olive-300 px-4 py-3.5 text-sm text-olive-500">
                    Bank account details coming soon
                  </div>
                )}
              </div>

              <p className="pt-2 text-center text-xs leading-relaxed text-olive-500">
                Questions about your donation? Call us at{" "}
                <a href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`} className="underline">
                  {siteInfo.phone}
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-olive-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Other Ways to Help" title="Give your time, skills, or network" align="center" />
          </Reveal>
          <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ways.map((way) => (
              <RevealItem key={way.title}>
                <div className="h-full rounded-3xl border border-olive-200/70 bg-cream-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-olive-900/10">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                    <way.icon size={22} />
                  </span>
                  <h3 className="mt-6 font-serif text-xl font-medium text-olive-950">{way.title}</h3>
                  <p className="mt-3 leading-relaxed text-olive-700">{way.description}</p>
                  <a
                    href="/contact"
                    className="mt-5 inline-block text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
                  >
                    Get in touch &rarr;
                  </a>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
