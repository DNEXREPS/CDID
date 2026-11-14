import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { getGamepasses, getGuide, getGuides } from "@/lib/data";
import type { GuideBlock } from "@/lib/types";
import { Container, VerificationBadge } from "@/components/ui";
import { SourceList } from "@/components/source-list";

export function generateStaticParams() {
  return getGuides().map((g) => ({ id: g.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const g = getGuide((await params).id);
  return g ? { title: `${g.title} — Guide`, description: g.summary } : {};
}

function Block({ b }: { b: GuideBlock }) {
  switch (b.type) {
    case "p":
      return <p className="leading-relaxed text-ink/80">{b.text}</p>;
    case "note":
      return (
        <p className="flex gap-3 border-l-2 border-rambu bg-rambu/10 p-4 text-sm leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {b.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {b.items.map((t) => (
            <li key={t} className="flex gap-3 leading-relaxed text-ink/80">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-merah" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-4">
          {b.items.map((t, i) => (
            <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-3">
              <span className="display text-2xl text-merah tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="pt-1 leading-relaxed text-ink/80">{t}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                {b.columns.map((c) => <th key={c} scope="col" className="py-3 pr-4 font-display text-[0.72rem] tracking-[0.1em] uppercase">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]} className="border-b border-ink/10 align-top">
                  {r.map((c, i) => (i === 0 ? <th key={i} scope="row" className="py-3 pr-4 font-semibold">{c}</th> : <td key={i} className="py-3 pr-4 text-ink/75">{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "link":
      return (
        <Link href={b.href} className="inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-merah">
          {b.text} <ArrowRight className="size-4" />
        </Link>
      );
    case "gamepasses":
      return (
        <ul className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {getGamepasses().map((p) => (
            <li key={p.id} className="flex gap-4 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.icon} alt="" width={64} height={64} loading="lazy" className="size-16 shrink-0 rounded-[3px] bg-bone object-cover" />
              <div className="min-w-0">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm font-medium tabular">{p.onSale ? `R$${p.price}` : <span className="text-ink/50">Not for sale</span>}</p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-ink/60">{p.description}</p>
                <a href={`https://www.roblox.com/game-pass/${p.passId}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[0.75rem] text-ink/55 underline-offset-4 hover:underline">
                  View on Roblox
                </a>
              </div>
            </li>
          ))}
        </ul>
      );
  }
}

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const g = getGuide((await params).id);
  if (!g) notFound();
  const all = getGuides();
  const idx = all.findIndex((x) => x.id === g.id);
  const next = all[(idx + 1) % all.length];

  return (
    <>
      <section className="border-b border-white/10 bg-carbon pt-16 md:pt-[4.5rem]">
        <Container className="py-12 md:py-16">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-silver hover:text-paper">
            <ArrowLeft className="size-4" /> All guides
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <p className="eyebrow text-steel">{g.category}</p>
            <VerificationBadge status={g.verification} dark />
          </div>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.4rem,7vw,5rem)]">{g.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-silver">{g.summary}</p>
        </Container>
      </section>
      <section className="bg-paper text-ink">
        <Container className="grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_18rem]">
          <article className="max-w-3xl space-y-6 text-[1.0625rem]">
            {g.blocks.map((b, i) => <Block key={i} b={b} />)}
            <SourceList ids={g.sourceIds} lastVerified="2026-11-14" className="!mt-12" />
          </article>
          <aside>
            <div className="sticky top-24 border border-ink/15 bg-white p-5">
              <p className="eyebrow text-ink/50">Next guide</p>
              <Link href={`/guides/${next.id}`} className="group mt-3 block">
                <p className="display text-xl group-hover:text-merah">{next.title}</p>
                <p className="mt-2 text-sm text-ink/60">{next.summary}</p>
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
