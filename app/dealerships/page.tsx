import type { Metadata } from "next";
import { getDealershipCounts, getDealerships, getRegions, getSeasonalMaps, getSourcesByIds, getVehicles } from "@/lib/data";
import { Container, PageHero, Plate, SectionHeading, VerificationBadge } from "@/components/ui";
import { DealershipLocator, type LocatorDealer } from "@/components/dealership-locator";
import { SourceList } from "@/components/source-list";

export const metadata: Metadata = {
  title: "Dealerships",
  description: "Find every Car Driving Indonesia dealership: which map and city it's in, nearby landmarks, and the cars it sells.",
};

const REGION_BY_MAP: Record<string, string> = { Jakarta: "jakarta", "Jawa Barat": "jawa-barat", "Jawa Tengah": "jawa-tengah", "Jawa Timur": "jawa-timur", Bali: "bali" };

export default function DealershipsPage() {
  const counts = getDealershipCounts();
  const vehicles = getVehicles();
  const regions = getRegions();
  const seasonal = getSeasonalMaps();

  const dealers: LocatorDealer[] = getDealerships().map((d) => {
    const sold = vehicles.filter((v) => v.dealershipId === d.id && v.availability === "dealership");
    return {
      ...d,
      current: counts[d.id]?.current ?? 0,
      regionIds: (d.mapName ?? "").split("·").map((s) => REGION_BY_MAP[s.trim()]).filter(Boolean),
      makes: [...new Set(sold.map((v) => v.manufacturer).filter((m): m is string => Boolean(m)))],
      preview: sold
        .filter((v) => v.image)
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        .slice(0, 8)
        .map(({ id, name, image, price }) => ({ id, name, image, price })),
    };
  });

  return (
    <>
      <PageHero
        eyebrow="Showroom directory"
        title="Dealerships"
        image="/images/media/shot-12846485522.webp"
        intro="Every CDID showroom we could identify, with the map it's on, nearby landmarks and the cars it sells. Pick a region on the route, search, or filter by brand."
      />
      <section className="bg-asphalt">
        <Container className="py-12 md:py-16">
          <DealershipLocator dealers={dealers} regions={regions.map((r) => ({ id: r.id, name: r.name }))} />
          <div className="mt-10 max-w-3xl text-sm leading-relaxed text-silver">
            <p>
              <strong className="text-paper">About locations.</strong> City placements come from the CDID Wiki&apos;s map article (last edited
              21 Jul 2025). That edit predates the Jawa Timur map (V2.2.0) and the Bandung rebuild (V2.7), so some showrooms may have moved.
              No source publishes in-game coordinates, so we describe locations by city and landmark instead of plotting points.
            </p>
            <SourceList ids={["src-wiki-map", "src-wiki-cars", "src-cdidrepo"]} lastVerified="2026-11-14" dark className="mt-6" />
          </div>
        </Container>
      </section>

      <section id="regions" className="border-t border-white/10 bg-carbon">
        <Container className="py-20 md:py-28">
          <SectionHeading eyebrow="The world" title="Regions & landmarks" intro="CDID's map follows Java's main corridor from Jakarta to the east, then crosses to Bali." />
          <ol className="mt-12 space-y-px bg-white/10">
            {regions.map((r) => (
              <li key={r.id} className="grid gap-6 bg-carbon py-10 lg:grid-cols-[18rem_1fr_20rem] lg:gap-10">
                <div>
                  <p className="eyebrow text-steel">Region 0{r.order}</p>
                  <h3 className="display mt-3 text-4xl">{r.name}</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {r.introducedVersion && <Plate>Since {r.introducedVersion}</Plate>}
                    <VerificationBadge status={r.verificationStatus} dark />
                  </div>
                </div>
                <div>
                  <p className="text-silver">{r.summary}</p>
                  {r.areas.length > 0 && (
                    <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      {r.areas.map((a) => (
                        <div key={a.name}>
                          <dt className="font-semibold">{a.name}</dt>
                          <dd className="mt-1 text-sm text-steel">{a.landmarks.length ? a.landmarks.join(" · ") : "Landmarks not documented"}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {(() => {
                    const here = dealers.filter((d) => d.regionIds.includes(r.id));
                    return (
                      <div className="mt-6 border border-white/10 bg-white/[0.02] p-4">
                        <p className="eyebrow text-steel">Dealerships in {r.name}</p>
                        {here.length ? (
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            {here.map((d) => (
                              <li key={d.id}>
                                <a href={`/dealerships/${d.id}`} className="text-paper underline-offset-4 hover:underline">{d.name}</a>
                                <span className="text-steel"> · {d.city}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-silver">None verified yet.</p>
                        )}
                        {r.dealershipNote && <p className="mt-3 text-[0.8rem] leading-relaxed text-steel">{r.dealershipNote}</p>}
                        {r.communityTours && r.communityTours.length > 0 && (
                          <ul className="mt-3 space-y-1 text-[0.8rem]">
                            {getSourcesByIds(r.communityTours).map((t) => (
                              <li key={t.id}>
                                <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-silver underline-offset-4 hover:text-paper hover:underline">
                                  {t.title.replace(/^YouTube — /, "")}
                                </a>{" "}
                                <span className="text-steel">· community video, not transcribed</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                  <SourceList ids={r.sourceIds} dark className="mt-6" />
                </div>
                {r.image ? (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt={r.imageCaption ?? r.name} loading="lazy" className="aspect-video w-full object-cover" />
                    <figcaption className="mt-2 text-[0.75rem] text-steel">{r.imageCaption}</figcaption>
                  </figure>
                ) : (
                  <div className="hidden aspect-video items-center justify-center border border-dashed border-white/15 text-[0.75rem] text-steel lg:flex">No verified screenshot</div>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <p className="eyebrow text-steel">Seasonal & limited-time maps</p>
            <ul className="mt-4 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {seasonal.map((m) => (
                <li key={m.name} className="bg-carbon p-5">
                  <Plate>{m.introducedVersion}</Plate>
                  <p className="mt-3 font-semibold">{m.name}</p>
                  <p className="mt-1 text-sm text-steel">{m.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
