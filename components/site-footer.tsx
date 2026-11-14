import Link from "next/link";
import { game, getSocialLinks } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { PlatformIcon } from "./icons";
import { Container, Wordmark } from "./ui";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/vehicles", label: "Vehicle catalogue" },
      { href: "/dealerships", label: "Dealership locator" },
      { href: "/updates", label: "Updates & patch notes" },
      { href: "/about", label: "The story of CDID" },
    ],
  },
  {
    title: "Play",
    links: [
      { href: "/guides/getting-started", label: "Getting started" },
      { href: "/guides/jobs", label: "Jobs & money" },
      { href: "/guides/gamepasses", label: "Game passes" },
      { href: "/guides", label: "All guides" },
    ],
  },
  {
    title: "Transparency",
    links: [
      { href: "/sources", label: "Sources & research" },
      { href: "/community", label: "Official channels" },
    ],
  },
];

export function SiteFooter() {
  const social = getSocialLinks().filter((s) => s.officialStatus === "official");
  return (
    <footer className="border-t border-white/10 bg-asphalt text-silver">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Wordmark className="text-[1.6rem] text-paper" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              Drive, work and roleplay across an ever-growing map of Indonesia, from Jakarta&apos;s boulevards to the roads of Bali.
            </p>
            <ul className="mt-6 flex gap-2">
              {social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-[3px] border border-white/15 text-silver transition-colors hover:border-white/50 hover:text-paper"
                    aria-label={`${s.accountName} on ${s.platform}`}
                  >
                    <PlatformIcon platform={s.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-steel">{c.title}</p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-silver hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="lane mt-14 text-silver" aria-hidden />

        <div className="mt-8 grid gap-6 text-[0.78rem] leading-relaxed text-steel lg:grid-cols-[2fr_1fr]">
          <p>
            <strong className="font-semibold text-silver">Independent project.</strong> This website is not owned, operated or endorsed
            by CDID Studio or Roblox Corporation. &ldquo;Car Driving Indonesia&rdquo;, &ldquo;CDID&rdquo;, in-game screenshots and vehicle renders belong to
            their respective owners and are shown for information. Data comes from official Roblox and Discord endpoints and from
            community sources, and every record is labelled with its sources.
          </p>
          <p className="lg:text-right">
            Content verified {formatDate(game.stats.asOf)} · Game version {game.currentVersion}
            <br />
            <Link href="/sources" className="link-underline text-silver hover:text-paper">
              How we verify information
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
