"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/team", label: "Board" },
  { href: "/blog", label: "Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-cream-100/90 backdrop-blur transition-shadow ${
        scrolled ? "border-olive-200/60 shadow-[0_4px_24px_-8px_rgba(54,59,37,0.18)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/logo-icon.png"
            alt=""
            width={340}
            height={424}
            priority
            className="h-11 w-auto transition-transform duration-300 group-hover:-rotate-6"
          />
          <Image
            src="/logo-wordmark.png"
            alt="Turning Olive Charity"
            width={700}
            height={126}
            priority
            className="h-6 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-1 text-sm font-medium text-olive-800 transition-colors hover:text-olive-600"
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-terracotta-500 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/get-involved"
            className="inline-flex items-center rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 hover:shadow-md"
          >
            Donate
          </Link>
        </div>

        <button
          className="text-olive-900 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-olive-200/60 bg-cream-100 lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 pb-6 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-olive-800 hover:bg-olive-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/get-involved"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-terracotta-500 px-5 py-3 text-center text-sm font-semibold text-cream-50"
              >
                Donate
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
