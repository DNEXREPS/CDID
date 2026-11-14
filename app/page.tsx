import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import {
  game, getDealershipCounts, getDealerships, getFeaturedVehicles, getRegions, getSocialLinks, getUpdates,
  getGamepasses, getSeasonalMaps,
} from "@/lib/data";
import { formatCompact, formatDate, formatNumber } from "@/lib/format";
import { Button, Container, Plate, SectionHeading, VerificationBadge, Wordmark } from "@/components/ui";
import { VehicleCard } from "@/components/vehicle-card";
import { DiscordIcon, PlatformIcon, RobloxIcon } from "@/components/icons";
import { LiveStats } from "@/components/live-stats";

const FEATURED_DEALERS = ["tokoma", "premium", "sumber-jaya", "otnas-esprit-works", "retro", "komercial"];

export default function HomePage() {
  const featured = getFeaturedVehicles();
  const updates = getUpdates().slice(0, 4);
  const [latest, ...recent] = updates;
  const counts = getDealershipCounts();
  const dealers = FEATURED_DEALERS.map((id) => getDealerships().find((d) => d.id === id)!).filter(Boolean);
  const regions = getRegions();
  const social = getSocialLinks().filter((s) => s.officialStatus === "official" && s.platform !== "Discord");
  const passes = getGamepasses().filter((p) => p.onSale);
  const seasonal = getSeasonalMaps();
  const s = game.stats;

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-asphalt">
        <div className="grain absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/media/shot-12846484501.webp"
            alt="Headlights on an Indonesian highway in Car Driving Indonesia"
            className="h-full w-full scale-[1.02] object-cover object-[60%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/55 to-asphalt/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-asphalt/90 via-asphalt/40 to-transparent" />
        </div>

        <Container className="pt-32 pb-12 md:pb-16">
          <div className="animate-rise max-w-4xl">
            <p className="eyebrow flex items-center gap-3 text-silver">
              <Plate>{game.currentVersion}</Plate>
              <span>Now live on Roblox · Halloween 2026</span>
            </p>
            <h1 className="mt-6">
              <span className="sr-only">Car Driving Indonesia (CDID)</span>
              <Wordmark className="text-[clamp(3.4rem,13vw,10rem)] text-paper" subClassName="mt-[0.18em] text-[max(0.19em,0.7rem)] tracking-[0.42em]" />
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-silver md:text-xl">
              Drive, meet new friends and roleplay together across an ever-evolving map of Indonesia, from Jakarta&apos;s
              boulevards and West Java&apos;s toll roads to the coast of Bali.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={game.robloxUrl} external icon={<RobloxIcon className="size-4" />}>
                Play now
              </Button>
              <Button href="/vehicles" variant="ghost" icon={<ArrowRight className="size-4" />}>
                Explore vehicles
              </Button>
              <Button href={game.discordUrl} external variant="ghost" icon={<DiscordIcon className="size-4" />}>
                Join Discord
              </Button>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 border-t border-white/15 md:grid-cols-4">
            {[
              ["On the road since", "2021"],
              ["Map regions", "5 + seasonal"],
              ["Vehicles catalogued", "2,500+"],
              ["Current version", game.currentVersion],
            ].map(([k, v], i) => (
              <div key={k} className={`py-5 pr-4 ${i % 2 ? "pl-4 md:pl-6" : ""} ${i > 1 ? "border-t border-white/15 md:border-t-0" : ""} ${i ? "md:border-l md:border-white/15 md:pl-6" : ""}`}>
                <dt className="eyebrow text-steel">{k}</dt>
                <dd className="display mt-2 text-3xl tabular md:text-4xl">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- CDID LIVE */}
      <section id="live" className="border-t border-white/10 bg-asphalt">
        <Container className="py-14 md:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow flex items-center gap-3 text-steel">
                <span className="h-px w-8 bg-merah" aria-hidden /> Real-time · Roblox
              </p>
              <h2 className="display mt-4 text-[clamp(2rem,5vw,3.5rem)]">CDID Live</h2>
            </div>
            <p className="max-w-md text-sm text-silver">Players, visits, favourites and rating, straight from Roblox&apos;s public API and refreshed every minute.</p>
          </div>
          <LiveStats variant="compact" baseline={{ asOf: s.asOf, visits: s.visits, favorites: s.favorites }} />
        </Container>
      </section>

      {/* ---------------------------------------------------------------- LATEST UPDATE */}
      <section className="border-t border-white/10 bg-carbon">
        <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="relative overflow-hidden">
            {latest.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={latest.image} alt={`${latest.version} key art`} className="aspect-video w-full object-cover" loading="lazy" />
            )}
            <div className="absolute top-4 left-4">
              <Plate>{latest.version}</Plate>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="eyebrow flex items-center gap-3 text-steel">
              <span className="h-px w-8 bg-merah" aria-hidden /> Latest update
            </p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">{latest.title}</h2>
            <p className="mt-5 text-silver">{latest.summary}</p>
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {latest.officialText.map((t) => (
                <li key={t} className="flex items-center gap-4 py-3 text-[0.95rem]">
                  <span className="h-2 w-2 shrink-0 bg-merah" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.8rem] text-steel">
              <VerificationBadge status="official" dark /> Quoted from the official Roblox changelog
            </div>
            <div className="mt-auto pt-10">
              <Link href="/updates" className="group inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.12em] uppercase [font-stretch:112%]">
                All patch notes <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
        <Container className="pb-20 md:pb-28">
          <ol className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {recent.map((u) => (
              <li key={u.id} className="bg-carbon">
                <Link href={`/updates#${u.id}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-graphite">
                  <div className="flex items-center justify-between">
                    <Plate>{u.version}</Plate>
                    <span className="text-[0.75rem] text-steel">{u.dateLabel.split("(")[0].trim()}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold [font-stretch:110%]">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-silver">{u.summary}</p>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- FEATURED VEHICLES */}
      <section className="bg-paper text-ink">
        <Container className="py-20 md:py-28">
          <SectionHeading
            dark={false}
            eyebrow="The line-up"
            title={<>From Kijang to<br className="hidden sm:block" /> hypercar</>}
            intro="Nearly 2,800 vehicles have appeared in CDID, from everyday Indonesian MPVs to billion-rupiah hypercars. Every car on this site lists the sources behind its price and specs."
            action={<Button href="/vehicles" variant="ghost-dark" icon={<ArrowRight className="size-4" />}>Full catalogue</Button>}
          />
          <div className="scrollbar-none -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {featured.map((v, i) => (
              <div key={v.id} className="w-[76%] shrink-0 snap-start sm:w-auto">
                <VehicleCard v={v} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- DEALERSHIPS */}
      <section className="bg-bone text-ink">
        <Container className="py-20 md:py-28">
          <SectionHeading
            dark={false}
            eyebrow="Showrooms"
            title="Find your dealer"
            intro="Brand showrooms in Jakarta, used-car lots in Bekasi, enthusiast cafés in Bandung. Each dealer lists the cars it sells and where to find it."
            action={<Button href="/dealerships" variant="ghost-dark" icon={<MapPin className="size-4" />}>Dealership locator</Button>}
          />
          <ul className="mt-12 grid border-t border-l border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
            {dealers.map((d, i) => (
              <li key={d.id} className="border-r border-b border-ink/15">
                <Link href={`/dealerships/${d.id}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-white md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="eyebrow text-ink/45 tabular">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-right text-[0.75rem] text-ink/55">{d.city ?? "Location not verified"}</span>
                  </div>
                  <h3 className="display mt-8 text-2xl">{d.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{d.description}</p>
                  <p className="mt-auto flex items-center justify-between pt-6 text-sm font-medium">
                    <span className="tabular">{formatNumber(counts[d.id]?.current ?? 0)} cars on sale</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- WORLD */}
      <section className="bg-asphalt">
        <Container className="py-20 md:py-28">
          <SectionHeading
            eyebrow="The map"
            title="Explore Indonesia"
            intro="One experience, five regions along the Java–Bali corridor, plus seasonal maps that come and go with each event."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {regions.filter((r) => r.image).map((r) => (
              <figure key={r.id} className="group relative overflow-hidden bg-carbon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image!} alt={r.imageCaption ?? r.name} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="eyebrow text-silver">Region 0{r.order}</p>
                  <p className="display mt-2 text-4xl">{r.name}</p>
                  <p className="mt-2 max-w-md text-sm text-silver">{r.imageCaption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <ol className="mt-4 grid gap-px bg-white/10 sm:grid-cols-3">
            {regions.filter((r) => !r.image).map((r) => (
              <li key={r.id} className="bg-carbon p-6">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-steel">Region 0{r.order}</p>
                  {r.introducedVersion && <Plate>{r.introducedVersion}</Plate>}
                </div>
                <p className="display mt-4 text-3xl">{r.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-silver">{r.areas.map((a) => a.name).join(" · ") || r.summary}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-silver">
            <span className="eyebrow text-steel">Seasonal maps</span>
            {seasonal.map((m) => (
              <span key={m.name} className="inline-flex items-center gap-2">
                <Plate className="!text-[0.62rem]">{m.introducedVersion}</Plate> {m.name}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/dealerships#regions" variant="ghost" icon={<ArrowRight className="size-4" />}>Regions & landmarks</Button>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- GAME INFO */}
      <section className="border-t border-white/10 bg-carbon">
        <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Game information" title="At a glance" intro={<>&ldquo;{game.officialDescription}&rdquo;</>} />
          <dl className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2">
            {[
              ["Platform", "Roblox"],
              ["Genre", game.genre],
              ["Developer", `${game.developer} (verified)`],
              ["First published", formatDate(game.created)],
              ["Current version", `${game.currentVersion} · updated ${formatDate(game.lastUpdated)}`],
              ["Price", "Free to play · optional game passes"],
              ["Rating", `${Math.round((s.upVotes / (s.upVotes + s.downVotes)) * 100)}% positive on ${formatDate(s.asOf)} · live figure above`],
              ["Game passes", `${passes.length} on sale, R$${Math.min(...passes.map((p) => p.price!))}–R$${Math.max(...passes.map((p) => p.price!))}`],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-white/10 py-5 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
                <dt className="eyebrow text-steel">{k}</dt>
                <dd className="mt-2 text-[0.95rem] text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- COMMUNITY */}
      <section className="relative isolate overflow-hidden bg-[#1d2050]">
        <div className="absolute inset-0 -z-10 opacity-25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/media/shot-14006209773.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#141638] via-[#1d2050]/95 to-[#1d2050]/60" />
        <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-3 text-[#c9ccff]">
              <DiscordIcon className="size-4" /> CDID Official Server
            </p>
            <h2 className="display mt-5 text-[clamp(2.4rem,6vw,4.75rem)]">
              {formatNumber(Math.floor(s.discordMembers / 1000) * 1000)}+ drivers.
              <br />
              One convoy.
            </h2>
            <p className="mt-6 max-w-xl text-lg text-[#dfe1ff]">
              Announcements, update previews, events and bug reports happen on the official CDID Discord. Join to find a convoy,
              a roleplay crew or your next car.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={game.discordUrl} external variant="light" icon={<DiscordIcon className="size-4" />}>
                Join the Discord
              </Button>
              <Button href="/community" variant="ghost" icon={<ArrowRight className="size-4" />}>
                All channels
              </Button>
            </div>
          </div>
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {social.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                  <PlatformIcon platform={l.platform} className="size-5 text-white/80" />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{l.accountName}</span>
                    <span className="block text-[0.8rem] text-[#c9ccff]">{l.platform} · {l.handle}</span>
                  </span>
                  <ArrowRight className="size-4 -rotate-45 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="relative isolate overflow-hidden bg-merah">
        <Container className="flex flex-col items-start justify-between gap-10 py-20 md:flex-row md:items-end md:py-24">
          <div>
            <p className="eyebrow text-white/75">Free on Roblox</p>
            <p className="display mt-4 text-[clamp(2.6rem,8vw,6rem)] text-white">
              Your keys
              <br />
              are waiting.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <Button href={game.robloxUrl} external variant="light" icon={<RobloxIcon className="size-4" />}>
              Play Car Driving Indonesia
            </Button>
            <p className="text-sm text-white/80">Place ID {game.placeId} · by {game.developer}</p>
          </div>
        </Container>
        <div className="lane absolute inset-x-0 bottom-6 text-white" aria-hidden />
      </section>
    </>
  );
}
