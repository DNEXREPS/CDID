"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cx, Wordmark } from "./ui";
import { RobloxIcon } from "./icons";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/dealerships", label: "Dealerships" },
  { href: "/updates", label: "Updates" },
  { href: "/guides", label: "Guides" },
  { href: "/community", label: "Community" },
  { href: "/live", label: "Live" },
];

const PLAY_URL = "https://www.roblox.com/games/6911148748/Car-Driving-Indonesia";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open || /^\/vehicles\/.+/.test(pathname);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-b border-white/10 bg-asphalt/92 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-merah focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 md:h-[4.5rem] lg:px-10">
        <Link href="/" prefetch={false} className="text-[1.15rem] text-paper" aria-label="CDID home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.slice(1).map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={cx(
                    "relative px-2 py-2 font-display text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors xl:px-3 xl:text-[0.78rem] xl:tracking-[0.12em] [font-stretch:112%]",
                    isActive(n.href) ? "text-paper" : "text-silver hover:text-paper",
                  )}
                >
                  {n.label}
                  <span className={cx("absolute inset-x-2 -bottom-0.5 xl:inset-x-3 h-0.5 bg-merah transition-transform duration-300 origin-left", isActive(n.href) ? "scale-x-100" : "scale-x-0")} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-2 rounded-[3px] bg-merah px-4 font-display text-[0.75rem] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-merah-deep sm:inline-flex [font-stretch:115%]"
          >
            <RobloxIcon className="size-4" />
            Play now
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-10 items-center justify-center rounded-[3px] border border-white/20 text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-asphalt lg:hidden">
        <nav aria-label="Mobile" className="px-4 py-6 sm:px-6">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className={cx("display text-3xl", isActive(n.href) ? "text-paper" : "text-silver")}>{n.label}</span>
                  <span className="eyebrow text-steel tabular">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-[3px] bg-merah font-display text-sm font-bold tracking-[0.12em] text-white uppercase"
          >
            <RobloxIcon className="size-4" /> Play on Roblox
          </a>
        </nav>
      </div>
    </header>
  );
}
