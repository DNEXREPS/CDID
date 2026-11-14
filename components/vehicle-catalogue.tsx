"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Gauge, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { VehicleIndexRow } from "@/lib/types";
import {
  DEFAULT_QUERY, PRICE_STEPS, SORTS, filterVehicles, paramsFromQuery, queryFromParams, type CatalogueQuery,
} from "@/lib/catalogue";
import { availabilityLabel, formatNumber, gamepassLabel } from "@/lib/format";
import { VehicleCard } from "./vehicle-card";
import { cx, EmptyState } from "./ui";

type Option = { value: string; label: string; count?: number };
export interface CatalogueFacets {
  makes: Option[];
  categories: Option[];
  dealers: Option[];
}

const PAGE = 24;

export function VehicleCatalogue({ initial, total, facets }: { initial: VehicleIndexRow[]; total: number; facets: CatalogueFacets }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = useMemo(() => queryFromParams(new URLSearchParams(params.toString())), [params]);
  const isDefault = paramsFromQuery(query) === "";

  const [rows, setRows] = useState<VehicleIndexRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const [panel, setPanel] = useState(false);
  const [text, setText] = useState(query.q);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    setError(null);
    fetch("/api/vehicles")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: { vehicles: VehicleIndexRow[] }) => setRows(d.vehicles))
      .catch((e: Error) => setError(e.message || "Network error"));
  }, []);
  useEffect(load, [load]);

  useEffect(() => setText(query.q), [query.q]);
  useEffect(() => setLimit(PAGE), [params]);
  useEffect(() => {
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  const update = useCallback(
    (patch: Partial<CatalogueQuery>) => {
      const qs = paramsFromQuery({ ...query, ...patch });
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [query, pathname, router],
  );

  const onText = (v: string) => {
    setText(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => update({ q: v }), 220);
  };

  const results = useMemo(() => (rows ? filterVehicles(rows, query) : null), [rows, query]);
  const dealerName = useMemo(() => Object.fromEntries(facets.dealers.map((d) => [d.value, d.label])), [facets.dealers]);

  // Before the full index arrives, the default view is the server-rendered first page.
  const showing = results ?? (isDefault ? initial : null);
  const count = results ? results.length : isDefault ? total : null;

  const active: { key: keyof CatalogueQuery; label: string }[] = [];
  if (query.q) active.push({ key: "q", label: `“${query.q}”` });
  if (query.make) active.push({ key: "make", label: query.make });
  if (query.cat) active.push({ key: "cat", label: query.cat === "__none" ? "Unclassified" : query.cat });
  if (query.dealer) active.push({ key: "dealer", label: dealerName[query.dealer] ?? query.dealer });
  if (query.pass) active.push({ key: "pass", label: query.pass === "none" ? "No game pass" : `${gamepassLabel[query.pass]} pass` });
  if (query.limited) active.push({ key: "limited", label: query.limited === "none" ? "Not limited" : query.limited === "exclusive" ? "Exclusive" : "Limited" });
  if (query.avail) active.push({ key: "avail", label: query.avail === "all" ? "Including removed" : availabilityLabel[query.avail as keyof typeof availabilityLabel] });
  if (query.pt) active.push({ key: "pt", label: query.pt });
  if (query.pmin) active.push({ key: "pmin", label: `≥ ${PRICE_STEPS.find((p) => p.value === query.pmin)?.label}` });
  if (query.pmax) active.push({ key: "pmax", label: `≤ ${PRICE_STEPS.find((p) => p.value === query.pmax)?.label}` });

  const filters = (
    <div className="space-y-6">
      <Select label="Manufacturer" value={query.make} onChange={(v) => update({ make: v })} options={facets.makes} all="All manufacturers" />
      <Select label="Category" value={query.cat} onChange={(v) => update({ cat: v })} options={facets.categories} all="All categories" />
      <Select label="Dealership" value={query.dealer} onChange={(v) => update({ dealer: v })} options={facets.dealers} all="All dealerships" />
      <Select
        label="Game pass"
        value={query.pass}
        onChange={(v) => update({ pass: v })}
        all="Any"
        options={[{ value: "none", label: "No game pass required" }, ...Object.entries(gamepassLabel).map(([value, label]) => ({ value, label: `${label} pass` }))]}
      />
      <Select
        label="Limited status"
        value={query.limited}
        onChange={(v) => update({ limited: v })}
        all="Any"
        options={[{ value: "limited", label: "Limited" }, { value: "exclusive", label: "Exclusive" }, { value: "none", label: "Not limited" }]}
      />
      <Select
        label="Availability"
        value={query.avail}
        onChange={(v) => update({ avail: v })}
        all="Current (hide removed)"
        options={[
          { value: "dealership", label: "On sale at a dealership" },
          { value: "event", label: "Event only" },
          { value: "minigame-box", label: "Minigame box" },
          { value: "removed", label: "Removed" },
          { value: "all", label: "Everything, including removed" },
        ]}
      />
      <Select
        label="Powertrain"
        value={query.pt}
        onChange={(v) => update({ pt: v })}
        all="Any"
        options={[{ value: "Combustion", label: "Combustion" }, { value: "Hybrid", label: "Hybrid" }, { value: "Electric", label: "Electric" }]}
      />
      <fieldset>
        <legend className="eyebrow text-ink/55">Price</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <MiniSelect label="Minimum price" value={query.pmin} onChange={(v) => update({ pmin: v })} placeholder="Min" options={PRICE_STEPS} />
          <MiniSelect label="Maximum price" value={query.pmax} onChange={(v) => update({ pmax: v })} placeholder="Max" options={PRICE_STEPS} />
        </div>
      </fieldset>
      <div className="flex gap-3 border border-dashed border-ink/20 p-3 text-[0.78rem] leading-relaxed text-ink/60">
        <Gauge className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          <span className="font-semibold text-ink/80">Horsepower filter unavailable.</span> No source we could check publishes in-game
          horsepower, so we don&apos;t estimate it.
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr]">
      {/* Desktop filters */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24">
          <div className="mb-6 flex items-center justify-between">
            <p className="display text-lg">Filters</p>
            {!isDefault && (
              <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="inline-flex items-center gap-1 text-[0.78rem] text-ink/60 hover:text-ink">
                <RotateCcw className="size-3.5" /> Reset
              </button>
            )}
          </div>
          {filters}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search vehicles by name</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45" aria-hidden />
            <input
              type="search"
              value={text}
              onChange={(e) => onText(e.target.value)}
              placeholder="Search 2,796 vehicles — e.g. Avanza, Skyline, Kijang…"
              className="h-12 w-full rounded-[3px] border border-ink/20 bg-white pr-4 pl-11 text-[0.95rem] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
            />
          </label>
          <div className="flex gap-3">
            <label className="relative flex-1 sm:w-60 sm:flex-none">
              <span className="sr-only">Sort vehicles</span>
              <select
                value={query.sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="h-12 w-full appearance-none rounded-[3px] border border-ink/20 bg-white px-4 text-[0.9rem] text-ink focus:border-ink focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value} disabled={"disabled" in s}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setPanel(true)}
              className="inline-flex h-12 items-center gap-2 rounded-[3px] border border-ink/20 bg-white px-4 text-sm font-medium text-ink lg:hidden"
              aria-expanded={panel}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal className="size-4" /> Filters
              {active.length > 0 && <span className="ml-0.5 bg-merah px-1.5 text-[0.7rem] text-white tabular">{active.length}</span>}
            </button>
          </div>
        </div>

        {/* Result summary + active chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-ink/65" aria-live="polite">
          <span className="mr-2">
            {count === null ? "Loading the catalogue…" : <><strong className="font-semibold text-ink tabular">{formatNumber(count)}</strong> {count === 1 ? "vehicle" : "vehicles"}</>}
          </span>
          {active.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => update({ [a.key]: DEFAULT_QUERY[a.key] })}
              className="inline-flex items-center gap-1.5 border border-ink/20 bg-white px-2 py-1 text-[0.78rem] text-ink hover:border-ink"
              aria-label={`Remove filter ${a.label}`}
            >
              {a.label} <X className="size-3" aria-hidden />
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-6">
          {error && !rows ? (
            <div className="flex flex-col items-center gap-4 border border-merah/40 bg-merah/5 px-6 py-12 text-center text-ink" role="alert">
              <AlertTriangle className="size-6 text-merah" aria-hidden />
              <p className="font-medium">The full catalogue couldn&apos;t be loaded ({error}).</p>
              <button type="button" onClick={load} className="inline-flex h-10 items-center gap-2 bg-ink px-4 text-sm font-semibold text-white">
                <RotateCcw className="size-4" /> Try again
              </button>
            </div>
          ) : showing === null ? (
            <SkeletonGrid />
          ) : showing.length === 0 ? (
            <EmptyState title="No vehicles match">
              Try a shorter search or remove a filter.{" "}
              <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="font-semibold text-ink underline underline-offset-4">
                Reset all filters
              </button>
            </EmptyState>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4">
                {showing.slice(0, limit).map((v, i) => (
                  <li key={v.id} className="flex">
                    <div className="flex w-full [&>a]:w-full">
                      <VehicleCard v={v} priority={i < 6} dealerName={v.dealershipId ? dealerName[v.dealershipId] : undefined} />
                    </div>
                  </li>
                ))}
              </ul>
              {showing.length > limit && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLimit((l) => l + PAGE * 2)}
                    disabled={!rows}
                    className="inline-flex h-12 items-center gap-2 rounded-[3px] border border-ink/25 px-6 font-display text-[0.8rem] font-bold tracking-[0.1em] text-ink uppercase hover:border-ink disabled:opacity-50 [font-stretch:115%]"
                  >
                    {rows ? "Show more vehicles" : "Loading…"}
                  </button>
                  <p className="text-[0.78rem] text-ink/55 tabular">
                    Showing {formatNumber(Math.min(limit, showing.length))} of {formatNumber(count ?? showing.length)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div id="filter-panel" hidden={!panel} className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
        <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setPanel(false)} aria-label="Close filters" />
        <div className="absolute inset-y-0 right-0 flex w-[min(24rem,100%)] flex-col bg-paper text-ink">
          <div className="flex h-16 items-center justify-between border-b border-ink/10 px-5">
            <p className="display text-lg">Filters</p>
            <button type="button" onClick={() => setPanel(false)} className="inline-flex size-10 items-center justify-center" aria-label="Close filters">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-ink/10 p-4">
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="h-12 border border-ink/25 text-sm font-semibold">
              Reset
            </button>
            <button type="button" onClick={() => setPanel(false)} className="h-12 bg-ink text-sm font-semibold text-white tabular">
              Show {count === null ? "" : formatNumber(count)} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, all }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; all: string }) {
  const id = `f-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-ink/55">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx("mt-2 h-11 w-full rounded-[3px] border bg-white px-3 text-[0.88rem] text-ink focus:border-ink focus:outline-none", value ? "border-ink" : "border-ink/20")}
      >
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.count !== undefined ? ` (${o.count})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function MiniSelect({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; placeholder: string }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cx("h-11 w-full rounded-[3px] border bg-white px-2 text-[0.85rem] text-ink focus:border-ink focus:outline-none", value ? "border-ink" : "border-ink/20")}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SkeletonGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4" aria-busy="true" aria-label="Loading vehicles">
      {Array.from({ length: 9 }).map((_, i) => (
        <li key={i} className="border border-ink/10 bg-white">
          <div className="skeleton aspect-[4/3]" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton mt-4 h-4 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}
