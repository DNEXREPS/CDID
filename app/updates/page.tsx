import type { Metadata } from "next";
import { game, getLimitedLog, getSourcesByIds, getUpdates, getVehicles } from "@/lib/data";
import { versionKey } from "@/lib/catalogue";
import { formatDate } from "@/lib/format";
import { Button, Container, PageHero } from "@/components/ui";
import { UpdateFeed, type FeedItem } from "@/components/update-feed";
import { DiscordIcon } from "@/components/icons";
import type { GameUpdate } from "@/lib/types";

export const metadata: Metadata = {
  title: "Updates & Patch Notes",
  description: "The Car Driving Indonesia update history, from V0.3 to the current V2.8: new cars, maps, events, jobs and fixes, with sources.",
};

const norm = (s: string) =>
  s.toLowerCase().replace(/murcezo/g, "murceso").replace(/denzu/g, "densu").replace(/[^a-z0-9+]+/g, " ").trim();

export default function UpdatesPage() {
  const vehicleByName = new Map(getVehicles().map((v) => [norm(v.name), v.id]));
  const log = new Map(getLimitedLog().map((e) => [e.version.replace(/\.0$/, ""), e]));
  const documented = getUpdates();
  const docVersions = new Set(documented.map((u) => u.version.replace(/\.0$/, "")));

  // Versions known only from the community limited-car log become minimal entries.
  const minimal: GameUpdate[] = [...log.keys()]
    .filter((v) => !docVersions.has(v))
    .map((v) => ({
      id: `v${v.slice(1).replace(/\./g, "-")}`,
      version: v,
      releaseDate: null,
      dateLabel: "Date not verified",
      dateConfidence: "unknown",
      title: `Update ${v}`,
      summary: "No changelog text has been recovered for this version. The community log records the limited and event vehicles it introduced.",
      officialText: [],
      changelog: {},
      status: "released",
      image: null,
      sourceIds: ["src-wiki-limited"],
    }));

  const items: FeedItem[] = [...documented, ...minimal]
    .sort((a, b) => versionKey(b.version) - versionKey(a.version))
    .map((u) => ({
      ...u,
      documented: u.officialText.length > 0,
      limitedVehicles: (log.get(u.version.replace(/\.0$/, ""))?.vehicles ?? []).map((v) => ({
        name: v.name,
        availability: v.availability,
        vehicleId: vehicleByName.get(norm(v.name)) ?? null,
      })),
      sourceTitles: getSourcesByIds(u.sourceIds).map((s) => ({ title: s.title, url: s.url, reliability: s.reliability })),
    }));

  return (
    <>
      <PageHero
        eyebrow="Update center"
        title="Patch notes"
        image="/images/media/shot-75212879644756.webp"
        intro={
          <>
            Every CDID update we could trace, newest first. Official changelog text is quoted word for word. Dates are marked
            approximate when they come from event names or archived listings. Current version: <strong className="text-paper">{game.currentVersion}</strong>,
            listing updated {formatDate(game.lastUpdated)}.
          </>
        }
      >
        <div className="mt-8">
          <Button href={game.discordUrl} external variant="ghost" icon={<DiscordIcon className="size-4" />}>
            Announcements on Discord
          </Button>
        </div>
      </PageHero>
      <section className="bg-asphalt">
        <Container className="py-12 md:py-16">
          <UpdateFeed items={items} />
        </Container>
      </section>
    </>
  );
}
