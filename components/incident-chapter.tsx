import { AlertOctagon, ArrowUpRight, BadgeCheck, CircleHelp, Flag, MessageSquare, ShieldAlert } from "lucide-react";
import type { EvidenceLabel, IncidentChapter as Chapter } from "@/lib/types";
import { getSourcesByIds } from "@/lib/data";
import { SourceList } from "./source-list";
import { UnavailableMedia, YouTubeFacade } from "./archive-media";
import { cx } from "./ui";

const LABEL: Record<EvidenceLabel, { icon: typeof BadgeCheck; tone: string; help: string }> = {
  Verified: { icon: BadgeCheck, tone: "text-emerald-300 border-emerald-300/35", help: "Supported by reliable primary evidence" },
  "Community Report": { icon: MessageSquare, tone: "text-violet-300 border-violet-300/35", help: "Reported by players or community sources" },
  Unverified: { icon: CircleHelp, tone: "text-rambu border-rambu/40", help: "Insufficient evidence" },
  Disputed: { icon: AlertOctagon, tone: "text-orange-300 border-orange-300/40", help: "Conflicting evidence exists" },
  Unknown: { icon: Flag, tone: "text-zinc-400 border-zinc-400/35", help: "No reliable information found" },
};

export function EvidenceBadge({ label }: { label: EvidenceLabel }) {
  const l = LABEL[label];
  const Icon = l.icon;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap", l.tone)} title={l.help}>
      <Icon className="size-3.5" aria-hidden /> {label}
    </span>
  );
}

export function IncidentChapter({ chapter }: { chapter: Chapter }) {
  const tiktok = getSourcesByIds([chapter.tiktok.sourceId])[0];
  return (
    <section id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="relative scroll-mt-20 overflow-hidden border-y border-merah/40 bg-[#140b0c]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-merah" aria-hidden />
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 md:py-24 lg:px-10">
        {/* Heading */}
        <p className="eyebrow flex items-center gap-3 text-red-300/80">
          <ShieldAlert className="size-4" aria-hidden /> Historical turning point · 17 May 2021
        </p>
        <h2 id={`${chapter.id}-title`} className="display mt-5 max-w-5xl text-[clamp(2.4rem,7vw,5.5rem)]">
          {chapter.title}
          <span className="block text-red-300/90">— {chapter.subtitle}</span>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-silver">{chapter.intro}</p>

        {/* Legend */}
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-label="Evidence labels">
          {(Object.keys(LABEL) as EvidenceLabel[]).map((k) => (
            <li key={k} className="flex items-center gap-2 text-[0.75rem] text-steel">
              <EvidenceBadge label={k} /> <span className="hidden sm:inline">{LABEL[k].help}</span>
            </li>
          ))}
        </ul>

        {/* Records & relationships */}
        <div className="mt-12">
          <p className="eyebrow text-steel">Separate records in this story</p>
          <ol className="mt-4 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {chapter.records.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 bg-[#140b0c] p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base font-bold [font-stretch:110%]">{r.label}</p>
                  <EvidenceBadge label={r.status} />
                </div>
                <p className="text-[0.8rem] leading-relaxed text-silver">{r.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[0.75rem] text-steel">
            Relationships: the original place and the GrandMini group share an owner. The V4-labelled copy refers players to that group but has a different owner. The relaunch (V5) is run by a new
            group whose developer also co-owns GrandMini. Any link to &lsquo;Lemon&rsquo; is a community report only.
          </p>
        </div>

        {/* TikTok primary reference */}
        {tiktok && (
          <aside className="mt-10 grid gap-4 border border-white/15 bg-black/30 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow text-steel">Primary research lead · {chapter.tiktok.creator}</p>
              <p className="mt-2 font-semibold">{tiktok.title}</p>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-silver">
                Supplied by the site owner as the main reference for this chapter. <strong className="text-paper">We could not access it</strong>: TikTok is blocked in our
                research environment, so nothing here is quoted from the video, and its claims are treated as leads rather than facts.
              </p>
            </div>
            <a
              href={chapter.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 justify-self-start rounded-[3px] border border-white/30 px-4 text-sm font-semibold hover:border-white"
            >
              Open on TikTok <ArrowUpRight className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </aside>
        )}

        {/* Sections */}
        <ol className="mt-14">
          {chapter.sections.map((s) => (
            <li key={s.id} id={`${chapter.id}-${s.id}`} className="grid scroll-mt-24 gap-6 border-t border-white/10 py-10 lg:grid-cols-[10rem_1fr]">
              <p className="display text-5xl text-red-300/25 tabular" aria-hidden>{s.n}</p>
              <article className="max-w-3xl">
                <EvidenceBadge label={s.label} />
                <h3 className="display mt-3 text-2xl md:text-3xl">{s.heading}</h3>
                {s.id === "unknown" ? (
                  <ul className="mt-4 space-y-2">
                    {s.body.map((b) => (
                      <li key={b} className="flex gap-3 leading-relaxed text-silver">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-zinc-400" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  s.body.map((b, i) => (
                    <p key={i} className="mt-4 leading-relaxed text-silver">{b}</p>
                  ))
                )}
                {s.media && s.media.length > 0 && (
                  <div className={cx("mt-6 grid gap-4", s.media.length > 1 && "sm:grid-cols-2")}>
                    {s.media.map((m, i) =>
                      m.type === "image" ? (
                        <figure key={i}>
                          <a href={m.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden bg-black" aria-label={`Open full image: ${m.caption}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={m.src} alt={m.caption} loading="lazy" className={m.src.includes("-icon") ? "mx-auto aspect-square w-full max-w-[18rem] object-contain" : "aspect-video w-full object-cover"} />
                          </a>
                          <figcaption className="mt-2 text-[0.75rem] leading-snug text-silver">
                            {m.caption}
                            <span className="block text-steel">{m.credit}</span>
                          </figcaption>
                        </figure>
                      ) : m.type === "youtube" ? (
                        <YouTubeFacade key={i} videoId={m.videoId} title={m.title} credit={m.credit} />
                      ) : (
                        <UnavailableMedia key={i} caption={m.caption} />
                      ),
                    )}
                  </div>
                )}
                {s.sourceIds.length > 0 && <SourceList ids={s.sourceIds} lastVerified="2026-11-14" dark className="mt-6" />}
              </article>
            </li>
          ))}
        </ol>

        {/* Evidence register */}
        <div className="mt-6 border-t border-white/10 pt-12">
          <p className="eyebrow text-steel">Evidence register</p>
          <h3 className="display mt-3 text-3xl">Claim by claim</h3>
          <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="border-b border-white/20">
                <tr>
                  {["Claim", "Status", "Evidence", "Sources"].map((h) => (
                    <th key={h} scope="col" className="py-2 pr-4 font-display text-[0.68rem] tracking-[0.12em] text-steel uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chapter.claims.map((c) => (
                  <tr key={c.claim} className="border-b border-white/10 align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-paper">{c.claim}</th>
                    <td className="py-3 pr-4"><EvidenceBadge label={c.label} /></td>
                    <td className="py-3 pr-4 text-silver">{c.evidence}</td>
                    <td className="py-3 pr-4">
                      {c.sourceIds.length ? (
                        <ul className="space-y-1">
                          {getSourcesByIds(c.sourceIds).map((s) => (
                            <li key={s.id}>
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[0.78rem] text-silver underline-offset-4 hover:text-paper hover:underline">
                                {s.title.length > 48 ? `${s.title.slice(0, 46)}…` : s.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-[0.78rem] text-steel">None found</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[0.8rem] leading-relaxed text-steel">
            This chapter documents allegations without endorsing them. No individual is accused here, and names that appear only in unverified accusations are deliberately omitted.
            Corrections backed by primary sources, such as original announcements or archived pages, are welcome.
          </p>
        </div>
      </div>
    </section>
  );
}
