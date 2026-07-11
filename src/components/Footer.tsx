import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteInfo } from "@/lib/content";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth={1.7} />
      <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" />
    </svg>
  );
}

const exploreLinks = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/team", label: "Our Board" },
  { href: "/blog", label: "Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
];

const involvedLinks = [
  { href: "/get-involved", label: "Donate" },
  { href: "/contact", label: "Volunteer" },
  { href: "/contact", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-olive-200/60 bg-olive-900 text-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-icon.png"
                alt=""
                width={340}
                height={424}
                className="h-10 w-auto"
              />
              <span className="font-serif text-lg font-medium text-cream-50">
                Turning Olive Charity
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-olive-200">
              {siteInfo.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/olive.charity_2025"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-olive-700 text-olive-200 transition-colors hover:border-terracotta-500 hover:bg-terracotta-500 hover:text-cream-50"
              >
                <InstagramIcon width={18} height={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-medium text-cream-50">Explore</h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-olive-200 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-serif text-sm font-medium text-cream-50">Touch a Life</p>
            <Link
              href="/get-involved"
              className="mt-2 inline-flex items-center rounded-full bg-terracotta-500 px-4 py-2 text-xs font-semibold text-cream-50 transition-colors hover:bg-terracotta-600"
            >
              Donate
            </Link>
          </div>

          <div>
            <h3 className="font-serif text-base font-medium text-cream-50">Get Involved</h3>
            <ul className="mt-4 space-y-3">
              {involvedLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-olive-200 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-medium text-cream-50">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-olive-200">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{siteInfo.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>{siteInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <span>{siteInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-olive-700/60 pt-8 text-xs text-olive-300 md:flex-row">
          <p>© {new Date().getFullYear()} {siteInfo.name}. All rights reserved.</p>
          <p>Registered charity &mdash; {siteInfo.registration}</p>
        </div>
      </div>
    </footer>
  );
}
