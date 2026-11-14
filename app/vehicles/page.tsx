import type { Metadata } from "next";
import { Suspense } from "react";
import { getDealerships, getVehicleIndex } from "@/lib/data";
import { filterVehicles, DEFAULT_QUERY } from "@/lib/catalogue";
import { formatNumber } from "@/lib/format";
import { Container, PageHero } from "@/components/ui";
import { VehicleCatalogue, type CatalogueFacets } from "@/components/vehicle-catalogue";
import { SourceList } from "@/components/source-list";

export const metadata: Metadata = {
  title: "Vehicles",
  description: "Search, filter and sort every Car Driving Indonesia vehicle by manufacturer, category, dealership, price, game pass and limited status.",
};

export default function VehiclesPage() {
  const index = getVehicleIndex();
  const current = index.filter((v) => v.availability !== "removed");
  const count = (key: (v: (typeof index)[number]) => string | null) => {
    const m = new Map<string, number>();
    for (const v of current) {
      const k = key(v);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  const makes = count((v) => v.manufacturer);
  const cats = count((v) => v.category);
  const dealers = count((v) => v.dealershipId);
  const facets: CatalogueFacets = {
    makes: [...makes].sort((a, b) => a[0].localeCompare(b[0])).map(([value, n]) => ({ value, label: value, count: n })),
    categories: [
      ...[...cats].sort((a, b) => b[1] - a[1]).map(([value, n]) => ({ value, label: value, count: n })),
      { value: "__none", label: "Unclassified", count: current.filter((v) => !v.category).length },
    ],
    dealers: getDealerships().map((d) => ({ value: d.id, label: d.name, count: dealers.get(d.id) ?? 0 })),
  };
  const initial = filterVehicles(index, DEFAULT_QUERY);

  return (
    <>
      <PageHero
        eyebrow="Vehicle catalogue"
        title="Every car in CDID"
        image="/images/media/shot-12846484501.webp"
        intro={
          <>
            {formatNumber(current.length)} current vehicles from {makes.size} in-game brands, plus {formatNumber(index.length - current.length)} removed models kept
            for reference. Prices are in-game rupiah, and every record shows its sources and when it was last verified.
          </>
        }
      />
      <section className="bg-paper text-ink">
        <Container className="py-10 md:py-14">
          <Suspense fallback={<p className="text-sm text-ink/60">Loading the catalogue…</p>}>
            <VehicleCatalogue initial={initial.slice(0, 24)} total={initial.length} facets={facets} />
          </Suspense>
          <div className="mt-16 max-w-3xl">
            <p className="text-sm leading-relaxed text-ink/65">
              <strong className="text-ink">About this data.</strong> Names, prices, engines, dealerships and status come from the community-run
              CDID Database. Body style, drivetrain and transmission come from the CDID Wiki where an article exists. Categories appear only when
              the wiki states a body style; every other car is listed as &ldquo;Unclassified&rdquo; rather than guessed.
            </p>
            <SourceList ids={["src-cdidrepo", "src-wiki-cars", "src-wiki-limited"]} lastVerified="2026-11-14" className="mt-6" />
          </div>
        </Container>
      </section>
    </>
  );
}
