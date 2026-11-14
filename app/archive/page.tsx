import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AlertOctagon, BadgeCheck, CircleDashed, HelpCircle, Layers, MessageSquare } from "lucide-react";
import { getArchive } from "@/lib/data";
import type { ArchiveEntry, HistoryVerification } from "@/lib/types";
import { Container, PageHero, Plate, cx } from "@/components/ui";
import { SourceList } from "@/components/source-list";
import { CompareSlider, UnavailableMedia, YouTubeFacade } from "@/components/archive-media";
import { IncidentChapter } from "@/components/incident-chapter";

export const metadata: Metadata = {
  title: "Archive — The History of CDID",
  description:
    "A sourced digital museum of Car Driving Indonesia: the 2020 predecessors, the classic V2.5–V4 era, the 2021 revamp and modern CDID, with authentic screenshots and period footage.",
};

const LEVELS: Record<HistoryVerification, { label: string; icon: typeof BadgeCheck; tone: string; help: string }> = {
  official: { label: "Officially confirmed", icon: BadgeCheck, tone: "text-emerald-300 border-emerald-300/30", help: "Read directly from an official Roblox record or CDID announcement." },
  multiple: { label: "Multiple independent sources", icon: Layers, tone: "text-sky-300 border-sky-300/30", help: "Supported by two or more independent sources." },
  community: { label: "Community-reported", icon: MessageSquare, tone: "text-violet-300 border-violet-300/30", help: "Reported by a community source, such as a developer's informal upload, the wiki or videos." },
  partial: { label: "Partially verified", icon: CircleDashed, tone: "text-rambu border-rambu/35", help: "Some parts are confirmed; others, such as dates or authorship, are not." },
  unconfirmed: { label: "Unconfirmed", icon: HelpCircle, tone: "text-zinc-400 border-zinc-400/30", help: "Could not be verified. Shown only to record what was checked." },
  disputed: { label: "Disputed", icon: AlertOctagon, tone: "text-orange-300 border-orange-300/40", help: "Sources conflict. Both sides are shown." },
};

function HistoryBadge({ level }: { level: HistoryVerification }) {
  const l = LEVELS[level];
  const Icon = l.icon;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap", l.tone)} title={l.help}>
      <Icon className="size-3.5" aria-hidden /> {l.label}
    </span>
  );
}

function Media({ entry }: { entry: ArchiveEntry }) {
  if (!entry.media.length) return null;
  const many = entry.media.length > 1;
  return (
    <div className={cx("mt-6 grid gap-4", many ? "sm:grid-cols-2 xl:grid-cols-3" : "max-w-xl")}>
      {entry.media.map((m, i) =>
        m.type === "image" ? (
          <figure key={i}>
            <a href={m.src} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden bg-black" aria-label={`Open full image: ${m.caption}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.caption} loading="lazy" className={cx("w-full transition-transform duration-500 group-hover:scale-[1.03]", m.src.includes("-icon") ? "mx-auto aspect-square max-w-[18rem] object-contain" : "aspect-video object-cover")} />
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
  );
}

export default function ArchivePage() {
  const { eras, entries, comparisons, gaps, places, incident } = getArchive();
  return (
    <>
      <PageHero
        eyebrow="Digital museum"
        title={<>The CDID<br />archive</>}
        image="/images/archive/v3-3-village-edition-1.webp"
        intro="From the 2020 predecessors to the classic V2.5–V4 builds, the 2021 revamp and today's CDID. Every exhibit links to its sources and states how well it's verified. Where original media no longer exists, we say so instead of recreating it."
      >
        <nav aria-label="Eras" className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
          {eras.map((e) => (
            <a key={e.id} href={`#${e.id}`} className="bg-carbon/90 p-4 transition-colors hover:bg-graphite">
              <span className="eyebrow text-steel tabular">Era {e.number}</span>
              <span className="mt-1 block font-display text-lg font-bold [font-stretch:110%]">{e.title}</span>
              <span className="block text-[0.75rem] text-silver">{e.period}</span>
            </a>
          ))}
        </nav>
        <a href={`#${incident.id}`} className="mt-3 inline-flex items-center gap-2 border border-merah/50 bg-merah/10 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-merah/20">
          Chapter: {incident.title} — {incident.subtitle}
        </a>
      </PageHero>

      <section className="border-b border-white/10 bg-carbon">
        <Container className="py-8">
          <p className="eyebrow text-steel">Verification levels</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
            {(Object.keys(LEVELS) as HistoryVerification[]).filter((k) => k !== "disputed" || entries.some((e) => e.verification === "disputed")).map((k) => (
              <li key={k} className="flex max-w-xs items-start gap-2 text-[0.75rem] text-silver">
                <HistoryBadge level={k} />
                <span className="hidden lg:inline">{LEVELS[k].help}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {eras.map((era) => (
        <Fragment key={era.id}>
        {era.id === "revamp" && <IncidentChapter chapter={incident} />}
        <section id={era.id} className="scroll-mt-20 border-b border-white/10 bg-asphalt odd:bg-asphalt even:bg-[#101114]">
          <Container className="py-16 md:py-24">
            <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
              <div>
                <p className="display text-6xl text-white/10 tabular md:text-8xl" aria-hidden>{era.number}</p>
                <p className="eyebrow mt-2 text-steel">{era.period}</p>
              </div>
              <div>
                <h2 className="display text-[clamp(2.2rem,6vw,4.5rem)]">{era.title}</h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-silver">{era.summary}</p>
              </div>
            </div>

            <ol className="mt-14 space-y-0">
              {entries
                .filter((e) => e.era === era.id)
                .map((e) => (
                  <li key={e.id} id={e.id} className="grid scroll-mt-24 gap-6 border-t border-white/10 py-10 lg:grid-cols-[16rem_1fr]">
                    <div>
                      <p className="font-display text-lg font-bold tabular [font-stretch:110%]">{e.dateLabel}</p>
                      {e.dateConfidence !== "exact" && (
                        <p className="mt-1 text-[0.7rem] font-medium tracking-wide text-rambu uppercase">
                          {e.dateConfidence === "approximate" ? "Approximate date" : "Date not verified"}
                        </p>
                      )}
                      {e.version && <Plate className="mt-3">{e.version}</Plate>}
                    </div>
                    <article>
                      <div className="flex flex-wrap items-center gap-3">
                        <HistoryBadge level={e.verification} />
                      </div>
                      <h3 className="display mt-3 text-2xl md:text-3xl">{e.title}</h3>
                      <p className="mt-3 max-w-3xl leading-relaxed text-silver">{e.description}</p>
                      <Media entry={e} />
                      <SourceList ids={e.sourceIds} lastVerified="2026-11-14" dark className="mt-6 max-w-3xl" />
                    </article>
                  </li>
                ))}
            </ol>

            {era.id === "revamp" && (
              <div className="mt-10 border-t border-white/10 pt-12">
                <p className="eyebrow text-steel">Before & after</p>
                <h3 className="display mt-3 text-3xl md:text-4xl">Classic vs modern</h3>
                <p className="mt-3 max-w-2xl text-silver">Drag the divider to compare authentic screenshots from the V2.5 archive place with today&apos;s official screenshots.</p>
                <div className="mt-8 grid gap-10 lg:grid-cols-2">
                  {comparisons.map((c) => (
                    <div key={c.id}>
                      <p className="mb-3 font-display text-lg font-bold [font-stretch:110%]">{c.title}</p>
                      <CompareSlider title={c.title} before={c.before} after={c.after} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
        </Fragment>
      ))}

      <section className="bg-carbon">
        <Container className="grid gap-14 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-steel">Places register</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">Roblox places in the story</h2>
            <p className="mt-3 text-sm text-silver">Creation dates from Roblox&apos;s own records, captured 14 Nov 2026.</p>
            <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="border-b border-white/20">
                  <tr>
                    {["Place", "Owner", "Created", "Status"].map((h) => (
                      <th key={h} scope="col" className="py-2 pr-3 font-display text-[0.68rem] tracking-[0.12em] text-steel uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {places.map((p) => (
                    <tr key={p.placeId} className="border-b border-white/10 align-top">
                      <td className="py-3 pr-3">
                        {p.status === "Public" ? (
                          <a href={`https://www.roblox.com/games/${p.placeId}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{p.name}</a>
                        ) : (
                          <span className="font-medium text-silver">{p.name}</span>
                        )}
                        <span className="block font-mono text-[0.7rem] text-steel">{p.placeId}</span>
                      </td>
                      <td className="py-3 pr-3 text-silver">{p.owner}</td>
                      <td className="py-3 pr-3 text-silver tabular">{p.created ?? "Unknown"}</td>
                      <td className={cx("py-3 pr-3", p.status === "Public" ? "text-emerald-300" : "text-steel")}>{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <p className="eyebrow text-steel">Gaps in the record</p>
            <h2 className="display mt-3 text-3xl md:text-4xl">What we couldn&apos;t verify</h2>
            <ul className="mt-6 space-y-3">
              {gaps.map((g) => (
                <li key={g} className="flex gap-3 text-sm leading-relaxed text-silver">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-rambu" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-silver">
              Have an original screenshot, video or announcement from 2020–2021? The historical record improves when primary sources surface. See{" "}
              <Link href="/sources" className="text-paper underline underline-offset-4">how we verify information</Link>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
