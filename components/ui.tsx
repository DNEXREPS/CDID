import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CircleDashed, ShieldQuestion, Users } from "lucide-react";
import type { Verification } from "@/lib/types";
import { verificationLabel } from "@/lib/format";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** CDID wordmark: expanded italic letterforms with the "Car Driving Indonesia" baseline. */
export function Wordmark({ className, compact = false, subClassName }: { className?: string; compact?: boolean; subClassName?: string }) {
  return (
    <span className={cx("inline-flex flex-col leading-none select-none", className)} aria-label="Car Driving Indonesia">
      <span className="display-italic text-[1.6em] leading-[0.82] tracking-[-0.04em]" aria-hidden>
        CD<span className="text-merah">I</span>D
      </span>
      {!compact && (
        <span className={cx("mt-[0.28em] font-semibold uppercase opacity-80", subClassName ?? "text-[0.36em] tracking-[0.22em]")} aria-hidden>
          Car Driving Indonesia
        </span>
      )}
    </span>
  );
}

/** Indonesian licence-plate chip, used for version numbers and codes. */
export function Plate({ children, tone = "dark", className }: { children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[3px] border px-2 py-[3px] font-display text-[0.72rem] font-bold tracking-[0.08em] uppercase tabular",
        "[font-stretch:112%]",
        tone === "dark" ? "border-white/70 bg-ink text-white shadow-[inset_0_0_0_2px_#121316]" : "border-ink/80 bg-white text-ink shadow-[inset_0_0_0_2px_#fff]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const vIcon = { official: BadgeCheck, community: Users, partial: CircleDashed, unverified: ShieldQuestion };
const vTone = {
  official: "text-hijau border-hijau/40 bg-hijau/8",
  community: "text-sky-700 border-sky-700/30 bg-sky-700/6",
  partial: "text-amber-700 border-amber-600/40 bg-amber-500/8",
  unverified: "text-zinc-500 border-zinc-400/50 bg-zinc-500/6",
};
const vToneDark = {
  official: "text-emerald-300 border-emerald-300/30",
  community: "text-sky-300 border-sky-300/30",
  partial: "text-rambu border-rambu/35",
  unverified: "text-zinc-400 border-zinc-400/30",
};

export function VerificationBadge({ status, dark = false, className }: { status: Verification; dark?: boolean; className?: string }) {
  const Icon = vIcon[status];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap",
        dark ? vToneDark[status] : vTone[status],
        className,
      )}
      title={verificationLabel[status]}
    >
      <Icon className="size-3.5" aria-hidden />
      {verificationLabel[status]}
    </span>
  );
}

type BtnProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "ghost" | "ghost-dark" | "discord";
  external?: boolean;
  className?: string;
  icon?: React.ReactNode;
};
export function Button({ href, children, variant = "primary", external, className, icon }: BtnProps) {
  const styles = {
    primary: "bg-merah text-white hover:bg-merah-deep",
    light: "bg-paper text-ink hover:bg-white",
    ghost: "border border-white/30 text-white hover:border-white hover:bg-white/5",
    "ghost-dark": "border border-ink/25 text-ink hover:border-ink hover:bg-ink/5",
    discord: "bg-[#5865F2] text-white hover:bg-[#4752c4]",
  }[variant];
  const cls = cx(
    "group inline-flex h-12 items-center justify-center gap-2.5 rounded-[3px] px-5 font-display text-[0.8rem] font-bold tracking-[0.1em] uppercase transition-colors duration-200 [font-stretch:115%]",
    styles,
    className,
  );
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {external && <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />}
    </>
  );
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export function SectionHeading({
  eyebrow, title, intro, dark = true, action, className,
}: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; dark?: boolean; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <p className={cx("eyebrow flex items-center gap-3", dark ? "text-steel" : "text-ink/55")}>
          <span className="h-px w-8 bg-merah" aria-hidden />
          {eyebrow}
        </p>
        <h2 className={cx("display mt-4 text-[clamp(2rem,5vw,3.75rem)]", dark ? "text-paper" : "text-ink")}>{title}</h2>
        {intro && <div className={cx("mt-5 max-w-2xl text-[1.0625rem] leading-relaxed", dark ? "text-silver" : "text-ink/70")}>{intro}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({
  eyebrow, title, intro, image, children,
}: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; image?: string; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-carbon">
      {image && (
        <div className="grain absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
        </div>
      )}
      <div className="mx-auto max-w-[1400px] px-4 pt-32 pb-14 sm:px-6 md:pt-40 md:pb-20 lg:px-10">
        <p className="eyebrow flex items-center gap-3 text-steel">
          <span className="h-px w-8 bg-merah" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="display animate-rise mt-5 max-w-5xl text-[clamp(2.6rem,8vw,6.5rem)]">{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-silver">{intro}</div>}
        {children}
      </div>
    </section>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function EmptyState({ title, children, dark = false }: { title: string; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cx("border border-dashed px-6 py-14 text-center", dark ? "border-white/15 text-silver" : "border-ink/20 text-ink/70")}>
      <p className={cx("display text-xl", dark ? "text-paper" : "text-ink")}>{title}</p>
      {children && <div className="mx-auto mt-3 max-w-md text-sm leading-relaxed">{children}</div>}
    </div>
  );
}
