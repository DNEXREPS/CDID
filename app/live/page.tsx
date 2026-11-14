import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { game } from "@/lib/data";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { LiveStats } from "@/components/live-stats";
import { SourceList } from "@/components/source-list";

export const metadata: Metadata = {
  title: "CDID Live — Game Statistics",
  description: "Live Car Driving Indonesia statistics from the public Roblox API: players online, total visits, favourites, rating and server sample.",
};

const UNAVAILABLE = [
  ["Server count for every map", "Roblox only lists servers per place, and the IDs of CDID's map sub-places are not public (Jawa Tengah is the exception), so we show a sample from that one map rather than a total."],
  ["Maximum server capacity of the game", "The published place is a single-player menu (Roblox reports a maximum of 1). Map servers hold 50 players, as reported by the Jawa Tengah server list."],
  ["History before this site started recording", "Roblox's public API only returns current figures. This site stores its own snapshots, at most every 10 minutes, so trends begin from the first deployment."],
  ["Individual players or private servers", "Never collected or displayed."],
];

export default function LivePage() {
  const baseline = { asOf: game.stats.asOf, visits: game.stats.visits, favorites: game.stats.favorites };
  return (
    <>
      <PageHero
        eyebrow="CDID Live"
        title="Game statistics"
        image="/images/media/shot-14006209773.webp"
        intro="Real-time figures for Car Driving Indonesia, collected from Roblox's public API by our server and refreshed every minute. Nothing here is estimated: if Roblox doesn't answer, we say so."
      >
        <a
          href={game.robloxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-silver"
        >
          Open on Roblox <ArrowUpRight className="size-4" />
        </a>
      </PageHero>
      <section className="bg-asphalt">
        <Container className="py-12 md:py-16">
          <LiveStats variant="full" baseline={baseline} />
        </Container>
      </section>
      <section className="border-t border-white/10 bg-carbon">
        <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading
            eyebrow="Methodology"
            title="How this works"
            intro={
              <>
                Our server asks Roblox for the game&apos;s statistics, votes and one map&apos;s server list, then caches the answer at the CDN for
                60 seconds. Every visitor shares that one request, so Roblox is never flooded. If Roblox fails, the panel keeps the last good figures
                and labels them as stale; with no data at all it shows an error instead of a number.
              </>
            }
          />
          <div>
            <h3 className="display text-2xl">Not available, and why</h3>
            <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {UNAVAILABLE.map(([k, v]) => (
                <div key={k} className="py-4">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-silver">{v}</dd>
                </div>
              ))}
            </dl>
            <SourceList
              ids={["src-roblox-universe-resolve", "src-roblox-api-stats", "src-roblox-votes", "src-roblox-servers"]}
              dark
              className="mt-8"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
