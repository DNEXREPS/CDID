"use client";

import { useState } from "react";
import { ImageOff, Play } from "lucide-react";
import { cx } from "./ui";

/** Click-to-load YouTube embed: no third-party requests until the visitor presses play (except the thumbnail). */
export function YouTubeFacade({ videoId, title, credit }: { videoId: string; title: string; credit: string }) {
  const [play, setPlay] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  return (
    <figure className="flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-black">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 flex items-center justify-center" aria-label={`Play video: ${title}`}>
            {!thumbFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={() => setThumbFailed(true)}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
            )}
            <span className="relative flex size-14 items-center justify-center rounded-full bg-merah text-white shadow-lg transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-6" fill="currentColor" aria-hidden />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[0.75rem] leading-snug text-silver">
        <span className="font-medium text-paper">{title}</span>
        <span className="block text-steel">
          {credit} ·{" "}
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            Watch on YouTube
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

export function UnavailableMedia({ caption }: { caption: string }) {
  return (
    <figure className="flex aspect-video flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-white/[0.02] p-4 text-center">
      <ImageOff className="size-6 text-steel" aria-hidden />
      <figcaption className="max-w-xs text-[0.75rem] leading-snug text-steel">
        <span className="block font-semibold text-silver">Original media unavailable</span>
        {caption}
      </figcaption>
    </figure>
  );
}

interface Side { src: string; label: string; caption: string; credit: string }

/** Before/after comparison with a draggable divider (keyboard accessible range input). */
export function CompareSlider({ title, before, after }: { title: string; before: Side; after: Side }) {
  const [pos, setPos] = useState(50);
  return (
    <figure>
      <div className="relative aspect-video select-none overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after.src} alt={`${after.label}: ${after.caption}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before.src} alt={`${before.label}: ${before.caption}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" style={{ left: `${pos}%` }} aria-hidden>
          <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow">⇆</span>
        </div>
        <span className="absolute top-3 left-3 bg-black/70 px-2 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase">{before.label}</span>
        <span className="absolute top-3 right-3 bg-black/70 px-2 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase">{after.label}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label={`${title}: drag to compare ${before.label} with ${after.label}`}
        />
      </div>
      <figcaption className="mt-3 grid gap-3 text-[0.78rem] leading-snug sm:grid-cols-2">
        <span className={cx("text-silver")}>
          <strong className="text-paper">{before.label}.</strong> {before.caption} <span className="block text-steel">{before.credit}</span>
        </span>
        <span className="text-silver sm:text-right">
          <strong className="text-paper">{after.label}.</strong> {after.caption} <span className="block text-steel">{after.credit}</span>
        </span>
      </figcaption>
    </figure>
  );
}
