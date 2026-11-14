import type { Metadata } from "next";
import { game, getTimeline } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import { Container, PageHero, Plate, SectionHeading } from "@/components/ui";
import { SourceList } from "@/components/source-list";

export const metadata: Metadata = {
  title: "About — The Story of CDID",
  description: "How Car Driving Indonesia grew from a 2021 Roblox experience into a half-billion-visit driving and roleplay game across Java and Bali.",
};

export default function AboutPage() {
  const timeline = getTimeline();
  const years = [...new Set(timeline.map((t) => (t.date ? t.date.slice(0, 4) : null)).filter(Boolean))] as string[];

  return (
    <>
      <PageHero
        eyebrow="About CDID"
        title={<>Built on<br />Indonesian roads</>}
        image="/images/media/shot-14006205781.webp"
        intro="Car Driving Indonesia started in June 2021 with a simple promise: the everyday experience of driving in Indonesia, on Roblox. It has since passed half a billion visits."
      />

      <section className="bg-paper text-ink">
        <Container className="grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading dark={false} eyebrow="Identity" title="Drive. Meet. Roleplay." />
          </div>
          <div className="prose-cdid text-[1.0625rem] text-ink/80">
            <p>
              The official description sums up the idea in one line: CDID is here &ldquo;to give you the experience of driving, meet new friends,
              and roleplaying together through the ever-evolving map of Indonesia.&rdquo;
            </p>
            <p>
              The map is the heart of the game. It runs from Jakarta&apos;s Monas and Bundaran HI, through the commuter cities, toll plazas and
              mountain roads of West Java, along Central Java&apos;s north coast and into East Java, then crosses to Bali. Players drive Indonesian
              favourites such as the Kijang and Avanza alongside imported exotics, take jobs as taxi, ambulance, bus or truck drivers, and meet up
              at drift arenas, circuits and car washes.
            </p>
            <p>
              Cars carry in-game brand names (Tokoma, Honade, Densu, Mestibis and dozens more) and are sold through a network of brand
              showrooms, used-car lots and enthusiast dealers. Seasonal updates follow the Indonesian calendar: Ramadhan, Eid al-Adha,
              Independence Day on 17 August, Halloween and Christmas.
            </p>
            <p>
              CDID is published by the verified <strong>{game.developer}</strong> on Roblox. The group is owned by {game.groupOwner}, whom the
              community wiki credits as the game&apos;s creator (known as &ldquo;shad&rdquo;).
            </p>
          </div>
        </Container>
        <Container className="pb-20 md:pb-28">
          <dl className="grid grid-cols-2 border-t border-l border-ink/15 lg:grid-cols-4">
            {[
              ["Published", formatDate(game.created)],
              ["Visits", formatNumber(game.stats.visits)],
              ["Group members", formatNumber(game.stats.groupMembers)],
              ["Current version", game.currentVersion],
            ].map(([k, v]) => (
              <div key={k} className="border-r border-b border-ink/15 p-6">
                <dt className="eyebrow text-ink/50">{k}</dt>
                <dd className="display mt-3 text-2xl tabular md:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[0.75rem] text-ink/50">Statistics from the Roblox API, {formatDate(game.stats.asOf)}.</p>
        </Container>
      </section>

      <section className="bg-asphalt">
        <Container className="py-20 md:py-28">
          <SectionHeading
            eyebrow="Timeline"
            title="Milestones"
            intro="Every milestone below links to its sources. Dates we couldn't confirm are marked approximate or unverified. The community wiki's original history page was lost to vandalism, so early years are sparse."
          />
          <nav aria-label="Jump to year" className="sticky top-16 z-10 -mx-4 mt-10 flex gap-1 overflow-x-auto border-y border-white/10 bg-asphalt/95 px-4 py-2 backdrop-blur md:top-[4.5rem] sm:mx-0 sm:px-0">
            {years.map((y) => (
              <a key={y} href={`#y${y}`} className="shrink-0 px-3 py-2 font-display text-sm font-bold tabular text-silver hover:text-paper [font-stretch:112%]">
                {y}
              </a>
            ))}
            <a href="#undated" className="shrink-0 px-3 py-2 font-display text-sm font-bold text-steel hover:text-paper [font-stretch:112%]">Undated</a>
          </nav>

          <ol className="mt-12 space-y-0">
            {timeline.map((t, i) => {
              const y = t.date?.slice(0, 4);
              const firstOfYear = y && timeline.findIndex((x) => x.date?.slice(0, 4) === y) === i;
              const firstUndated = !t.date && timeline.findIndex((x) => !x.date) === i;
              return (
                <li
                  key={t.id}
                  id={firstOfYear ? `y${y}` : firstUndated ? "undated" : undefined}
                  className="grid scroll-mt-36 gap-6 border-t border-white/10 py-10 md:grid-cols-[14rem_1fr] lg:grid-cols-[14rem_1fr_18rem] lg:gap-10"
                >
                  <div>
                    <p className="display text-3xl tabular">{y ?? "—"}</p>
                    <p className="mt-2 text-sm text-silver">{t.dateLabel}</p>
                    {t.dateConfidence !== "exact" && (
                      <p className="mt-1 text-[0.7rem] font-medium tracking-wide text-rambu uppercase">
                        {t.dateConfidence === "approximate" ? "Approximate" : "Not verified"}
                      </p>
                    )}
                  </div>
                  <div>
                    {t.version && <Plate>{t.version}</Plate>}
                    <h3 className="display mt-3 text-2xl md:text-3xl">{t.title}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-silver">{t.description}</p>
                    <SourceList ids={t.sourceIds} dark className="mt-6 max-w-2xl" />
                  </div>
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt="" loading="lazy" className="hidden aspect-video w-full object-cover lg:block" />
                  ) : (
                    <span className="hidden lg:block" />
                  )}
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
    </>
  );
}
