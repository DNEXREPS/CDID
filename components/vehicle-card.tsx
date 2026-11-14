import Link from "next/link";
import { Car } from "lucide-react";
import { availabilityLabel, formatRpShort, gamepassLabel } from "@/lib/format";
import type { VehicleIndexRow } from "@/lib/types";
import { cx } from "./ui";

export function VehicleImage({ src, alt, className, priority = false }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  if (!src)
    return (
      <div className={cx("flex flex-col items-center justify-center gap-2 text-ink/30", className)}>
        <Car className="size-10" aria-hidden />
        <span className="text-[0.7rem] tracking-wide uppercase">Image unavailable</span>
      </div>
    );
  return (
    // Pre-optimised 250px WebP renders with transparent backgrounds.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={250}
      height={250}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      className={cx("object-contain drop-shadow-[0_18px_14px_rgba(0,0,0,0.22)]", className)}
    />
  );
}

export function VehicleCard({ v, dealerName, priority }: { v: VehicleIndexRow; dealerName?: string; priority?: boolean }) {
  const removed = v.availability === "removed";
  return (
    <Link
      href={`/vehicles/${v.id}`}
      className="group relative flex flex-col overflow-hidden border border-ink/10 bg-white text-ink transition-[border-color,box-shadow] duration-300 hover:border-ink/30 hover:shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)]"
    >
      <div className="showroom relative aspect-[4/3] overflow-hidden">
        <VehicleImage
          src={v.image}
          alt={v.name}
          priority={priority}
          className={cx("absolute inset-0 m-auto h-[88%] w-[88%] transition-transform duration-500 ease-[var(--ease-drive)] group-hover:scale-[1.05]", removed && "opacity-60 grayscale")}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {v.isNew && <span className="bg-merah px-1.5 py-0.5 text-[0.62rem] font-bold tracking-[0.12em] text-white uppercase">New</span>}
          {v.limited && (
            <span className="bg-ink px-1.5 py-0.5 text-[0.62rem] font-bold tracking-[0.12em] text-white uppercase">
              {v.limited === "exclusive" ? "Exclusive" : "Limited"}
            </span>
          )}
          {v.availability !== "dealership" && (
            <span className="border border-ink/20 bg-white/85 px-1.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.1em] text-ink/70 uppercase">
              {availabilityLabel[v.availability]}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 border-t border-ink/10 p-4">
        <div>
          <p className="eyebrow text-ink/50">
            {v.manufacturer ?? "Unknown make"}
            {v.year ? ` · ${v.year}` : ""}
          </p>
          <h3 className="mt-1.5 font-display text-[1.02rem] leading-snug font-bold [font-stretch:108%]">{v.name}</h3>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-ink/15 pt-3 text-[0.8rem]">
          <span className="font-display text-[1.05rem] font-bold tabular [font-stretch:110%]">{formatRpShort(v.price)}</span>
          <span className="truncate text-right text-ink/55">
            {v.gamepass ? `${gamepassLabel[v.gamepass]} pass` : dealerName ?? v.category ?? ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
