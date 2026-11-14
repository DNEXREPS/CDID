import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { game, getSocialLinks } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { Button, Container, PageHero, SectionHeading, VerificationBadge, cx } from "@/components/ui";
import { DiscordIcon, PlatformIcon } from "@/components/icons";
import { SourceList } from "@/components/source-list";
import type { SocialLink } from "@/lib/types";

export const metadata: Metadata = {
  title: "Community",
  description: "Official Car Driving Indonesia channels: the CDID Discord, Roblox experience and group, Instagram and TikTok, plus community resources.",
};

function LinkRow({ l }: { l: SocialLink }) {
  return (
    <li className="grid gap-4 border-b border-white/10 py-6 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-6">
      <span className="flex size-12 items-center justify-center rounded-[3px] border border-white/15">
        <PlatformIcon platform={l.platform} className="size-5" />
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-semibold">{l.accountName}</p>
          <VerificationBadge status={l.verificationStatus} dark />
        </div>
        <p className="mt-0.5 text-sm text-steel">{l.platform} · {l.handle}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-silver">{l.description}</p>
      </div>
      <a
        href={l.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center gap-2 justify-self-start rounded-[3px] border border-white/25 px-4 text-sm font-semibold hover:border-white md:justify-self-end"
      >
        Visit <ArrowUpRight className="size-4" />
        <span className="sr-only">{l.accountName} (opens in a new tab)</span>
      </a>
    </li>
  );
}

export default function CommunityPage() {
  const links = getSocialLinks();
  const official = links.filter((l) => l.officialStatus === "official");
  const community = links.filter((l) => l.officialStatus === "community");
  const discord = links.find((l) => l.id === "discord")!;

  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Ride together"
        image="/images/media/shot-14006209773.webp"
        intro="CDID is a social game, and most of the action happens off the road too: update previews, events and convoys. These are the verified places to find it."
      />

      <section className={cx("relative isolate overflow-hidden bg-[#1d2050]")}>
        <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow flex items-center gap-2 text-[#c9ccff]"><DiscordIcon className="size-4" /> Official Discord</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,6vw,4.5rem)]">{discord.accountName}</h2>
            <p className="mt-5 max-w-xl text-lg text-[#dfe1ff]">
              The main hub for announcements, changelogs, events and bug reports. About {formatNumber(Math.floor(game.stats.discordMembers / 1000) * 1000)} members.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={discord.url} external variant="light" icon={<DiscordIcon className="size-4" />}>Join discord.gg/cdid</Button>
            </div>
          </div>
          <div className="border border-white/15 bg-black/20 p-6 text-sm leading-relaxed text-[#dfe1ff]">
            <p className="font-semibold text-white">How we verified it</p>
            <p className="mt-2">
              The invite resolves through Discord&apos;s public API to the server &ldquo;CDID Official Server&rdquo;, which uses the vanity code <code>cdid</code> and describes
              itself as the &ldquo;Official Roblox Car Driving Indonesia Discord server.&rdquo; Other invite links shared online lead to the same server.
            </p>
            <p className="mt-2 text-[#c9ccff]">We did not read any channels; that needs a Discord account. Nothing on this site is quoted from Discord.</p>
          </div>
        </Container>
      </section>

      <section className="bg-asphalt">
        <Container className="py-16 md:py-24">
          <SectionHeading eyebrow="Official channels" title="From the studio" intro="Accounts run by, or confirmed as belonging to, CDID Studio. Self-described accounts we couldn't open directly are marked partially verified." />
          <ul className="mt-10 border-t border-white/10">{official.map((l) => <LinkRow key={l.id} l={l} />)}</ul>
          <p className="mt-6 text-sm text-steel">
            No official YouTube channel could be confirmed, so none is listed. Watch out for impersonators: accounts such as &ldquo;update leaks&rdquo; pages are not run by CDID Studio.
          </p>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-carbon">
        <Container className="py-16 md:py-24">
          <SectionHeading eyebrow="Community resources" title="Made by players" intro="Fan-run projects that document the game. Not affiliated with CDID Studio." />
          <ul className="mt-10 border-t border-white/10">{community.map((l) => <LinkRow key={l.id} l={l} />)}</ul>
          <SourceList ids={[...new Set(links.flatMap((l) => l.sourceIds))]} lastVerified="2026-11-14" dark className="mt-10 max-w-3xl" />
        </Container>
      </section>
    </>
  );
}
