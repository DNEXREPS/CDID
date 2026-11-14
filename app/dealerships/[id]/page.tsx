import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Landmark, MapPin } from "lucide-react";
import { getDealership, getDealerships, getVehiclesByDealership } from "@/lib/data";
import { formatDate, formatNumber, formatRpShort } from "@/lib/format";
import { Button, Container, VerificationBadge } from "@/components/ui";
import { VehicleCard } from "@/components/vehicle-card";
import { SourceList } from "@/components/source-list";

export function generateStaticParams() {
  return getDealerships().map((d) => ({ id: d.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = getDealership((await params).id);
  return d ? { title: d.name, description: `${d.name} in Car Driving Indonesia: location, landmarks and vehicles for sale.` } : {};
}

export default async function DealershipPage({ params }: { params: Promise<{ id: string }> }) {
  const d = getDealership((await params).id);
  if (!d) notFound();
  const all = getVehiclesByDealership(d.id);
  const onSale = all.filter((v) => v.availability === "dealership");
  const prices = onSale.map((v) => v.price).filter((p): p is number => p !== null);
  const makes = [...new Set(onSale.map((v) => v.manufacturer).filter(Boolean))];
  const showcase = onSale.filter((v) => v.image).sort((a, b) => (b.price ?? 0) - (a.price ?? 0)).slice(0, 12);

  return (
    <>
      <section className="border-b border-white/10 bg-carbon pt-16 md:pt-[4.5rem]">
        <Container className="py-12 md:py-16">
          <Link href="/dealerships" className="inline-flex items-center gap-2 text-sm text-silver hover:text-paper">
            <ArrowLeft className="size-4" /> Dealership locator
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <p className="eyebrow text-steel">{d.category}</p>
            <VerificationBadge status={d.verificationStatus} dark />
          </div>
          <h1 className="display mt-4 text-[clamp(2.4rem,7vw,5.5rem)]">{d.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-silver">{d.description}</p>
          <dl className="mt-10 grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
            {[
              ["On sale", formatNumber(onSale.length)],
              ["Brands", formatNumber(makes.length)],
              ["From", prices.length ? formatRpShort(Math.min(...prices)) : "—"],
              ["Up to", prices.length ? formatRpShort(Math.max(...prices)) : "—"],
            ].map(([k, v], i) => (
              <div key={k} className={`border-b border-white/10 py-5 ${i % 2 ? "pl-5 border-l md:border-l" : ""} ${i === 2 ? "md:border-l md:pl-5" : ""}`}>
                <dt className="eyebrow text-steel">{k}</dt>
                <dd className="display mt-2 text-2xl tabular md:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-asphalt">
        <Container className="grid gap-px bg-white/10 py-px md:grid-cols-3">
          <div className="bg-asphalt p-6 md:p-8">
            <p className="eyebrow flex items-center gap-2 text-steel"><MapPin className="size-3.5" /> Map & city</p>
            <p className="mt-3 text-xl font-semibold">{[d.mapName, d.city].filter(Boolean).join(" — ") || "Not verified"}</p>
            <p className="mt-2 text-[0.75rem] text-steel">In-game coordinates: not published</p>
          </div>
          <div className="bg-asphalt p-6 md:p-8">
            <p className="eyebrow text-steel">Directions</p>
            <p className="mt-3 text-sm leading-relaxed text-silver">{d.locationDescription}</p>
          </div>
          <div className="bg-asphalt p-6 md:p-8">
            <p className="eyebrow flex items-center gap-2 text-steel"><Landmark className="size-3.5" /> Nearby landmarks</p>
            {d.nearbyLandmarks.length ? (
              <ul className="mt-3 space-y-1 text-sm text-silver">{d.nearbyLandmarks.map((l) => <li key={l}>— {l}</li>)}</ul>
            ) : (
              <p className="mt-3 text-sm text-steel">None verified.</p>
            )}
          </div>
        </Container>
        <Container className="pb-10">
          <SourceList ids={d.sourceIds} lastVerified={d.lastVerified} dark />
        </Container>
      </section>

      <section className="bg-paper text-ink">
        <Container className="py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-ink/55">In the showroom</p>
              <h2 className="display mt-3 text-4xl">Most valuable on sale</h2>
              {makes.length > 0 && <p className="mt-3 max-w-2xl text-sm text-ink/60">Brands: {makes.sort().join(", ")}</p>}
            </div>
            <Button href={`/vehicles?dealer=${d.id}`} variant="ghost-dark" icon={<ArrowRight className="size-4" />}>
              All {formatNumber(onSale.length)} vehicles
            </Button>
          </div>
          {showcase.length ? (
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {showcase.map((v) => <li key={v.id} className="flex [&>a]:w-full"><VehicleCard v={v} /></li>)}
            </ul>
          ) : (
            <p className="mt-10 border border-dashed border-ink/20 p-10 text-center text-ink/60">
              No vehicles are currently listed for sale here. {all.length > 0 && `${all.length} removed or event vehicles were previously linked to this dealership.`}
            </p>
          )}
          <p className="mt-8 text-[0.78rem] text-ink/50">Stock as of {formatDate(d.lastVerified)}. Weekly drops and limited releases change often.</p>
        </Container>
      </section>
    </>
  );
}
