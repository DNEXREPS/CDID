"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Landmark, MapPin, Search, X } from "lucide-react";
import type { Dealership, VehicleIndexRow } from "@/lib/types";
import { formatRpShort } from "@/lib/format";
import { RegionStrip } from "./region-strip";
import { VehicleImage } from "./vehicle-card";
import { cx, EmptyState, VerificationBadge } from "./ui";

export interface LocatorDealer extends Dealership {
  current: number;
  regionIds: string[];
  makes: string[];
  preview: Pick<VehicleIndexRow, "id" | "name" | "image" | "price">[];
}

export function DealershipLocator({ dealers, regions }: { dealers: LocatorDealer[]; regions: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [make, setMake] = useState("");
  const [selected, setSelected] = useState<string>(dealers[0]?.id ?? "");

  const makes = useMemo(() => [...new Set(dealers.flatMap((d) => d.makes))].sort((a, b) => a.localeCompare(b)), [dealers]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return dealers.filter(
      (d) =>
        (!t || `${d.name} ${d.brand} ${d.city ?? ""} ${d.nearbyLandmarks.join(" ")}`.toLowerCase().includes(t)) &&
        (!region || (region === "__unknown" ? d.regionIds.length === 0 : d.regionIds.includes(region))) &&
        (!make || d.makes.includes(make)),
    );
  }, [dealers, q, region, make]);
  const current = list.find((d) => d.id === selected) ?? list[0];
  const stripRegions = regions.map((r) => ({ ...r, count: dealers.filter((d) => d.regionIds.includes(r.id)).length }));
  const unknownCount = dealers.filter((d) => d.regionIds.length === 0).length;

  return (
    <div>
      <div className="border border-white/10 bg-carbon p-5 md:p-8">
        <RegionStrip regions={stripRegions} value={region} onChange={setRegion} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_15rem_15rem]">
        <label className="relative">
          <span className="sr-only">Search dealerships</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-steel" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by dealership, city or landmark"
            className="h-12 w-full rounded-[3px] border border-white/15 bg-carbon pr-4 pl-11 text-paper placeholder:text-steel focus:border-white/60 focus:outline-none"
          />
        </label>
        <select
          aria-label="Filter by manufacturer sold"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="h-12 rounded-[3px] border border-white/15 bg-carbon px-3 text-paper focus:border-white/60 focus:outline-none"
        >
          <option value="">All manufacturers</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          aria-label="Filter by map"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-12 rounded-[3px] border border-white/15 bg-carbon px-3 text-paper focus:border-white/60 focus:outline-none"
        >
          <option value="">All maps</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
          <option value="__unknown">Location not verified ({unknownCount})</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-silver" aria-live="polite">
        <span>
          <strong className="text-paper tabular">{list.length}</strong> of {dealers.length} dealerships
        </span>
        {(q || region || make) && (
          <button type="button" onClick={() => { setQ(""); setRegion(""); setMake(""); }} className="inline-flex items-center gap-1 text-silver hover:text-paper">
            <X className="size-3.5" /> Clear
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState dark title="No dealerships found">Try another search term, or clear the map and manufacturer filters.</EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <ul className="max-h-[42rem] divide-y divide-white/10 overflow-y-auto border border-white/10" aria-label="Dealerships">
            {list.map((d) => {
              const active = current?.id === d.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(d.id)}
                    aria-pressed={active}
                    className={cx("flex w-full items-start gap-3 px-4 py-4 text-left transition-colors", active ? "bg-paper text-ink" : "hover:bg-white/5")}
                  >
                    <MapPin className={cx("mt-0.5 size-4 shrink-0", active ? "text-merah" : "text-steel")} aria-hidden />
                    <span className="flex-1">
                      <span className="block font-semibold">{d.name}</span>
                      <span className={cx("block text-[0.8rem]", active ? "text-ink/60" : "text-steel")}>
                        {d.city ?? "Location not verified"} · {d.current} on sale
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {current && (
            <article className="border border-white/10 bg-carbon" aria-live="polite">
              <div className="border-b border-white/10 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow text-steel">{current.category}</p>
                  <VerificationBadge status={current.verificationStatus} dark />
                </div>
                <h3 className="display mt-4 text-[clamp(1.8rem,4vw,2.75rem)]">{current.name}</h3>
                <p className="mt-3 max-w-2xl text-silver">{current.description}</p>
              </div>
              <div className="grid gap-px bg-white/10 md:grid-cols-2">
                <div className="bg-carbon p-6">
                  <p className="eyebrow flex items-center gap-2 text-steel"><MapPin className="size-3.5" /> Location</p>
                  <p className="mt-3 font-semibold">{[current.mapName, current.city].filter(Boolean).join(" — ") || "Not verified"}</p>
                  <p className="mt-2 text-sm leading-relaxed text-silver">{current.locationDescription}</p>
                  <p className="mt-3 text-[0.75rem] text-steel">In-game coordinates: not published</p>
                </div>
                <div className="bg-carbon p-6">
                  <p className="eyebrow flex items-center gap-2 text-steel"><Landmark className="size-3.5" /> Nearby landmarks</p>
                  {current.nearbyLandmarks.length ? (
                    <ul className="mt-3 space-y-1.5 text-sm text-silver">
                      {current.nearbyLandmarks.map((l) => <li key={l}>— {l}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-steel">No landmarks verified.</p>
                  )}
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <p className="eyebrow text-steel">Vehicles on sale · {current.current}</p>
                  <Link href={`/vehicles?dealer=${current.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-paper hover:underline">
                    Browse all <ArrowRight className="size-4" />
                  </Link>
                </div>
                {current.preview.length ? (
                  <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {current.preview.map((v) => (
                      <li key={v.id}>
                        <Link href={`/vehicles/${v.id}`} className="group block bg-paper text-ink">
                          <div className="showroom aspect-[4/3]">
                            <VehicleImage src={v.image} alt={v.name} className="h-full w-full p-2 transition-transform group-hover:scale-105" />
                          </div>
                          <div className="p-2.5">
                            <p className="line-clamp-2 text-[0.78rem] leading-snug font-semibold">{v.name}</p>
                            <p className="mt-1 text-[0.72rem] text-ink/60 tabular">{formatRpShort(v.price)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-steel">No vehicles currently listed for sale at this dealership.</p>
                )}
                <Link href={`/dealerships/${current.id}`} className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-silver">
                  Dealership page & sources <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
