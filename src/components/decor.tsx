export function OliveBranch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 400" fill="none" {...props}>
      <path
        d="M100 390C100 390 92 300 100 220C108 140 100 20 100 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
      {[
        [100, 340, -1],
        [100, 300, 1],
        [100, 260, -1],
        [100, 220, 1],
        [100, 180, -1],
        [100, 140, 1],
        [100, 100, -1],
        [100, 60, 1],
      ].map(([x, y, dir], i) => (
        <ellipse
          key={i}
          cx={Number(x) + Number(dir) * 26}
          cy={y}
          rx="22"
          ry="11"
          fill="currentColor"
          opacity={0.5 + (i % 3) * 0.12}
          transform={`rotate(${Number(dir) * -28} ${Number(x) + Number(dir) * 26} ${y})`}
        />
      ))}
    </svg>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
    >
      <pattern id="dot-grid" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.6" fill="currentColor" />
      </pattern>
      <rect width="120" height="120" fill="url(#dot-grid)" />
    </svg>
  );
}

const swatches = {
  olive: "from-olive-500 via-olive-600 to-olive-800",
  terracotta: "from-terracotta-400 via-terracotta-500 to-olive-700",
};

export function ArtPanel({
  tone = "olive",
  className = "",
  children,
}: {
  tone?: "olive" | "terracotta";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-gradient-to-br ${swatches[tone]} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_90%,rgba(0,0,0,0.18),transparent_50%)]" />
      <DotGrid className="absolute -bottom-4 -right-4 h-28 w-28 text-cream-50/20" />
      <svg
        className="absolute -top-6 -left-6 h-32 w-32 text-cream-50/10"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {children}
    </div>
  );
}

import Image from "next/image";

export function PhotoPanel({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-olive-950/25 via-transparent to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-cream-50/20" />
    </div>
  );
}

export function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`pointer-events-none -mb-px ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="h-[40px] w-full">
        <path
          d="M0 40C240 10 480 0 720 12C960 24 1200 52 1440 30V60H0V40Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
