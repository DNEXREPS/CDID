import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Ticket } from "lucide-react";
import { game, getBrand, getDealership, getGamepass, getVehicle, getVehicles } from "@/lib/data";
import { availabilityLabel, formatDate, formatRp, formatRpShort } from "@/lib/format";
import { Button, Container, Plate, VerificationBadge, cx } from "@/components/ui";
import { VehicleCard, VehicleImage } from "@/components/vehicle-card";
import { SourceList } from "@/components/source-list";
import { RobloxIcon } from "@/components/icons";

export function generateStaticParams() {
  return getVehicles().map((v) => ({ id: v.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const v = getVehicle((await params).id);
  if (!v) return {};
  return {
    title: v.name,
    description: `${v.name} in Car Driving Indonesia — ${formatRp(v.price)}${v.engine ? `, ${v.engine}` : ""}. Dealership, game pass, availability and sources.`,
    openGraph: v.image ? { images: [{ url: v.image, width: 250, height: 250, alt: v.name }] } : undefined,
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const v = getVehicle((await params).id);
  if (!v) notFound();
  const dealer = getDealership(v.dealershipId);
  const pass = getGamepass(v.gamepass);
  const brand = getBrand(v.manufacturer);
  const related = getVehicles()
    .filter((o) => o.id !== v.id && o.manufacturer && o.manufacturer === v.manufacturer && o.availability !== "removed" && o.image)
    .sort((a, b) => Math.abs((a.price ?? 0) - (v.price ?? 0)) - Math.abs((b.price ?? 0) - (v.price ?? 0)))
    .slice(0, 4);

  const nv = "Not verified";
  const specs: [string, React.ReactNode][] = [
    ["Manufacturer", v.manufacturer ? <>{v.manufacturer}{v.realLifeBrand && <span className="text-ink/50"> · based on {v.realLifeBrand}</span>}</> : nv],
    ["Model", v.model ?? nv],
    ["Model year", v.year ?? nv],
    ["Category", v.category ?? "Unclassified"],
    ["Body style", v.bodyStyle ?? nv],
    ["Engine", v.engine ?? nv],
    ["Powertrain", v.powertrain ? `${v.powertrain} (derived from engine)` : nv],
    ["Horsepower", nv],
    ["Drivetrain", v.drivetrain ?? nv],
    ["Transmission", v.transmission ?? nv],
    ["Real-life counterpart", v.realLifeCounterpart ?? nv],
  ];

  return (
    <>
      <section className="showroom relative overflow-hidden pt-16 text-ink md:pt-[4.5rem]">
        <Container className="pt-8">
          <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink">
            <ArrowLeft className="size-4" /> All vehicles
          </Link>
        </Container>
        <Container className="grid items-center gap-10 pb-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-20">
          <div className="relative order-2 lg:order-1">
            <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center display text-[clamp(4rem,14vw,11rem)] text-ink/[0.045] select-none" aria-hidden>
              {v.manufacturer ?? "CDID"}
            </p>
            <VehicleImage src={v.image} alt={`${v.name}, in-game render`} priority className="relative mx-auto aspect-square w-full max-w-[34rem]" />
            <p className="mt-2 text-center text-[0.72rem] text-ink/45">In-game render · 250 px source image from Roblox</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex flex-wrap items-center gap-2">
              {v.isNew && <span className="bg-merah px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase">New</span>}
              {v.limited && <span className="bg-ink px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase">{v.limited}</span>}
              <span className={cx("border px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.1em] uppercase", v.availability === "dealership" ? "border-hijau/40 text-hijau" : "border-ink/25 text-ink/65")}>
                {availabilityLabel[v.availability]}
              </span>
              {v.introducedVersion && <Plate>{v.introducedVersion}</Plate>}
            </div>
            <p className="eyebrow mt-6 text-ink/55">
              {v.manufacturer ?? "Unknown make"}
              {v.year ? ` · ${v.year}` : ""}
            </p>
            <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.75rem)]">{v.name}</h1>
            <p className="mt-6 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold tabular [font-stretch:110%]">{formatRp(v.price)}</p>
            {v.price && <p className="text-sm text-ink/55">In-game price · {formatRpShort(v.price)}</p>}

            <dl className="mt-8 grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2">
              <div className="border-b border-ink/15 py-4 sm:pr-4">
                <dt className="eyebrow flex items-center gap-2 text-ink/50"><MapPin className="size-3.5" /> Dealership</dt>
                <dd className="mt-1.5 font-medium">
                  {dealer ? <Link href={`/dealerships/${dealer.id}`} className="link-underline">{dealer.name}</Link> : v.availability === "event" ? "Event reward" : v.availability === "minigame-box" ? "Minigame box" : nv}
                  {dealer?.city && <span className="block text-sm font-normal text-ink/55">{dealer.city}</span>}
                </dd>
              </div>
              <div className="border-b border-ink/15 py-4 sm:border-l sm:pl-4">
                <dt className="eyebrow flex items-center gap-2 text-ink/50"><Ticket className="size-3.5" /> Game pass</dt>
                <dd className="mt-1.5 font-medium">
                  {pass ? <>{pass.name} <span className="font-normal text-ink/55">· R${pass.price}</span></> : "None required"}
                </dd>
              </div>
              <div className="border-b border-ink/15 py-4 sm:pr-4">
                <dt className="eyebrow text-ink/50">Availability</dt>
                <dd className="mt-1.5 font-medium">
                  {availabilityLabel[v.availability]}
                  {v.limitedWindow && <span className="block text-sm font-normal text-ink/55">Release window: {v.limitedWindow}</span>}
                </dd>
              </div>
              <div className="border-b border-ink/15 py-4 sm:border-l sm:pl-4">
                <dt className="eyebrow text-ink/50">Introduced</dt>
                <dd className="mt-1.5 font-medium">
                  {v.introducedVersion ? <Link href="/updates" className="link-underline">Update {v.introducedVersion}</Link> : nv}
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={game.robloxUrl} external icon={<RobloxIcon className="size-4" />}>Drive it in CDID</Button>
              {dealer && <Button href={`/vehicles?dealer=${dealer.id}`} variant="ghost-dark" icon={<ArrowRight className="size-4" />}>More from {dealer.name}</Button>}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper text-ink">
        <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="display text-3xl">Specifications</h2>
              <VerificationBadge status={v.verification} />
            </div>
            <dl className="mt-6 border-t border-ink/15">
              {specs.map(([k, val]) => (
                <div key={k} className="grid gap-1 border-b border-ink/10 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="text-sm text-ink/55">{k}</dt>
                  <dd className={cx("text-[0.95rem]", val === nv && "text-ink/40 italic")}>{val}</dd>
                </div>
              ))}
            </dl>
            {(v.drivetrain || v.transmission || v.bodyStyle) && (
              <p className="mt-4 text-[0.78rem] leading-relaxed text-ink/55">
                Body style, drivetrain and transmission come from the wiki&apos;s model article and may cover several trims of this model.
              </p>
            )}
            {v.flaggedInaccurate && (
              <p className="mt-4 border-l-2 border-rambu bg-rambu/10 p-3 text-sm">The community database flags this record as possibly inaccurate.</p>
            )}
          </div>
          <aside className="space-y-6">
            <div className="border border-ink/15 bg-white p-5">
              <p className="eyebrow text-ink/50">Record</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-ink/55">Last verified</dt><dd className="tabular">{formatDate(v.lastVerified)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink/55">Status</dt><dd><VerificationBadge status={v.verification} /></dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink/55">Source record</dt><dd className="font-mono text-[0.75rem]">{v.sourceRecordId}</dd></div>
              </dl>
              {v.wikiPage && (
                <a href={v.wikiPage} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium link-underline">
                  Wiki article <ExternalLink className="size-3.5" />
                </a>
              )}
              <SourceList ids={v.sourceIds} className="mt-4" />
            </div>
            {brand?.realLifeCounterpart && (
              <p className="text-[0.8rem] leading-relaxed text-ink/55">
                CDID uses in-game brand names. The CDID Wiki lists <strong className="text-ink">{brand.name}</strong> as modelled on {brand.realLifeCounterpart}.
              </p>
            )}
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-bone text-ink">
          <Container className="py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display text-3xl">More from {v.manufacturer}</h2>
              <Link href={`/vehicles?make=${encodeURIComponent(v.manufacturer!)}`} className="text-sm font-medium link-underline">View all</Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.id} className="flex [&>a]:w-full"><VehicleCard v={r} /></li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
