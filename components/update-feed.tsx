"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { Changelog, GameUpdate, UpdateStatus } from "@/lib/types";
import { cx, EmptyState, Plate } from "./ui";

export interface FeedVehicle {
  name: string;
  availability: string | null;
  vehicleId: string | null;
}
export interface FeedItem extends GameUpdate {
  limitedVehicles: FeedVehicle[];
  sourceTitles: { title: string; url: string; reliability: string }[];
  documented: boolean;
}

const STATUSES: { value: UpdateStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "released", label: "Released" },
  { value: "announced", label: "Announced" },
  { value: "upcoming", label: "Upcoming" },
  { value: "rumored", label: "Rumoured" },
  { value: "unverified", label: "Unverified" },
];

const SECTION_LABEL: Record<keyof Changelog, string> = {
  vehicles: "Vehicles",
  maps: "Maps",
  dealerships: "Dealerships",
  features: "Features",
  jobs: "Jobs",
  events: "Events",
  gameplay: "Gameplay",
  fixes: "Bug fixes",
};

export function UpdateFeed({ items }: { items: FeedItem[] }) {
  const [status, setStatus] = useState<(typeof STATUSES)[number]["value"]>("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // Open the entry targeted by the URL hash (e.g. links from the homepage).
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      setStatus("all");
      setOpen((o) => ({ ...o, [id]: true }));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const shown = items.filter((u) => status === "all" || u.status === status);
  const count = (s: string) => (s === "all" ? items.length : items.filter((u) => u.status === s).length);

  return (
    <div>
      <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b border-white/10 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Update status">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            role="tab"
            aria-selected={status === s.value}
            onClick={() => setStatus(s.value)}
            className={cx(
              "relative shrink-0 px-4 py-3 font-display text-[0.75rem] font-bold tracking-[0.12em] uppercase [font-stretch:112%]",
              status === s.value ? "text-paper" : "text-steel hover:text-silver",
            )}
          >
            {s.label} <span className="ml-1 tabular opacity-60">{count(s.value)}</span>
            {status === s.value && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-merah" />}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-10">
          <EmptyState dark title={`No ${STATUSES.find((s) => s.value === status)?.label.toLowerCase()} updates`}>
            We haven&apos;t found any {STATUSES.find((s) => s.value === status)?.label.toLowerCase()} updates in official sources. Rumours
            and leaks are never listed as confirmed updates; follow the official Discord for announcements.
          </EmptyState>
        </div>
      ) : (
        <ol className="relative mt-10">
          <span className="absolute top-2 bottom-2 left-[0.6rem] w-px bg-white/10 md:left-[11.6rem]" aria-hidden />
          {shown.map((u) => {
            const isOpen = !!open[u.id];
            const sections = (Object.keys(SECTION_LABEL) as (keyof Changelog)[]).filter((k) => u.changelog[k]?.length);
            return (
              <li key={u.id} id={u.id} className="relative grid scroll-mt-28 gap-4 pb-12 pl-8 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
                <span className={cx("absolute top-1.5 left-1 size-3 rotate-45 border-2 md:left-[11.25rem]", u.documented ? "border-merah bg-merah" : "border-steel bg-asphalt")} aria-hidden />
                <div className="md:pt-0.5 md:text-right">
                  <Plate>{u.version}</Plate>
                  <p className="mt-2 flex items-center gap-1.5 text-[0.78rem] text-silver md:justify-end">
                    <CalendarDays className="size-3.5" aria-hidden /> {u.dateLabel.split("(")[0].trim()}
                  </p>
                  {u.dateConfidence !== "exact" && (
                    <p className="mt-1 text-[0.68rem] text-rambu">{u.dateConfidence === "approximate" ? "Approximate date" : "Date not verified"}</p>
                  )}
                </div>
                <article className={cx("md:pl-10", u.documented ? "" : "opacity-90")}>
                  <div className={cx("grid gap-6", u.image && "lg:grid-cols-[1fr_18rem]")}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-emerald-300/30 px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-emerald-300 uppercase">{u.status}</span>
                        {!u.documented && <span className="text-[0.72rem] text-steel">Changelog not recovered</span>}
                        {u.documented && u.officialText.length === 0 && <span className="text-[0.72rem] text-steel">Summarised from community guides</span>}
                      </div>
                      <h2 className="display mt-3 text-2xl md:text-3xl">{u.title}</h2>
                      <p className="mt-3 max-w-2xl text-silver">{u.summary}</p>
                    </div>
                    {u.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.image} alt={`${u.version} cover`} loading="lazy" className="aspect-video w-full object-cover" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [u.id]: !o[u.id] }))}
                    aria-expanded={isOpen}
                    aria-controls={`${u.id}-log`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-[0.75rem] font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-silver"
                  >
                    {isOpen ? "Hide" : "Full"} changelog
                    <ChevronDown className={cx("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
                  </button>

                  <div id={`${u.id}-log`} hidden={!isOpen} className="mt-5 border border-white/10 bg-carbon">
                    {u.officialText.length > 0 && (
                      <div className="border-b border-white/10 p-5">
                        <p className="eyebrow text-steel">Official changelog text</p>
                        <ul className="mt-3 space-y-1 font-mono text-[0.82rem] text-silver">
                          {u.officialText.map((t) => <li key={t}>- {t}</li>)}
                        </ul>
                      </div>
                    )}
                    {sections.length > 0 && (
                      <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
                        {sections.map((k) => (
                          <div key={k} className="bg-carbon p-5">
                            <dt className="eyebrow text-steel">{SECTION_LABEL[k]}</dt>
                            <dd>
                              <ul className="mt-2 space-y-1 text-sm">
                                {u.changelog[k]!.map((t) => <li key={t}>{t}</li>)}
                              </ul>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {u.limitedVehicles.length > 0 && (
                      <div className="border-t border-white/10 p-5">
                        <p className="eyebrow text-steel">Limited, event & drop vehicles ({u.limitedVehicles.length}) · community log</p>
                        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                          {u.limitedVehicles.map((v) => (
                            <li key={v.name} className="flex justify-between gap-3 border-b border-white/5 pb-1.5">
                              {v.vehicleId ? <Link href={`/vehicles/${v.vehicleId}`} className="link-underline">{v.name}</Link> : <span>{v.name}</span>}
                              {v.availability && <span className="shrink-0 text-right text-[0.75rem] text-steel">{v.availability}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="border-t border-white/10 p-5">
                      <p className="eyebrow text-steel">Sources</p>
                      <ul className="mt-2 space-y-1 text-[0.8rem]">
                        {u.sourceTitles.map((s) => (
                          <li key={s.title}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-silver underline-offset-4 hover:underline">{s.title}</a>
                            <span className="text-steel"> · {s.reliability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
