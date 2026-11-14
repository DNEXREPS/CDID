"use client";

import { cx } from "./ui";

export interface StripRegion {
  id: string;
  name: string;
  count: number;
}

/**
 * Schematic of CDID's Java–Bali corridor. It is a navigation aid only: no in-game
 * coordinates have been published, so it shows region order, not real positions.
 */
export function RegionStrip({ regions, value, onChange }: { regions: StripRegion[]; value: string; onChange: (id: string) => void }) {
  return (
    <div>
      <div className="relative">
        <div className="lane absolute inset-x-0 top-[1.15rem] text-silver" aria-hidden />
        <ol className="relative grid grid-cols-5 gap-1" role="radiogroup" aria-label="Filter by map region">
          {regions.map((r, i) => {
            const active = value === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(active ? "" : r.id)}
                  className="group flex w-full flex-col items-center gap-3 text-center"
                >
                  <span
                    className={cx(
                      "relative flex size-9 items-center justify-center rounded-full border-2 font-display text-[0.7rem] font-bold tabular transition-colors",
                      active ? "border-merah bg-merah text-white" : "border-silver/60 bg-asphalt text-silver group-hover:border-paper group-hover:text-paper",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cx("font-display text-[0.68rem] leading-tight font-bold tracking-[0.06em] uppercase sm:text-[0.8rem] [font-stretch:110%]", active ? "text-paper" : "text-silver")}>
                    {r.name}
                  </span>
                  <span className="text-[0.68rem] text-steel tabular">{r.count} dealer{r.count === 1 ? "" : "s"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-5 text-[0.72rem] text-steel">
        Schematic of the map regions from west to east, not to scale. CDID has not published in-game coordinates, so positions are not shown.
      </p>
    </div>
  );
}
