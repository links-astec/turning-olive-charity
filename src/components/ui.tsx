import Link from "next/link";
import { ReactNode } from "react";
import { Shirt, ChefHat } from "lucide-react";
import type { Program } from "@/lib/content";
import { OliveBranch } from "@/components/decor";
import { Reveal } from "@/components/motion";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-olive-200/60 bg-gradient-to-b from-olive-50 to-cream-100">
      <div
        className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-olive-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-terracotta-300/25 blur-3xl"
        aria-hidden
      />
      <OliveBranch className="pointer-events-none absolute -top-6 right-0 h-[26rem] w-auto text-olive-300/25 sm:right-10" />
      <Reveal className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-terracotta-600">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight text-olive-950 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-olive-700">
            {description}
          </p>
        )}
      </Reveal>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-terracotta-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-balance font-serif text-3xl font-medium text-olive-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-lg leading-relaxed text-olive-700">
          {description}
        </p>
      )}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ghost-dark";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";
  const variants = {
    primary: "bg-terracotta-500 text-cream-50 hover:bg-terracotta-600",
    secondary: "bg-olive-600 text-cream-50 hover:bg-olive-700",
    ghost: "border border-olive-300 text-olive-800 hover:bg-olive-100",
    "ghost-dark": "border border-olive-200/30 text-cream-50 hover:bg-olive-800",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

const programIcons = {
  shirt: Shirt,
  chefHat: ChefHat,
};

export function ProgramIcon({ icon, size = 22 }: { icon: Program["icon"]; size?: number }) {
  const Icon = programIcons[icon];
  return <Icon size={size} strokeWidth={2} />;
}
