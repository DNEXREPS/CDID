"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowUpRight, Info, RefreshCw, Server } from "lucide-react";
import { cx } from "./ui";

// ---- Types mirror netlify/lib/live-core.mjs ----------------------------------------------------
export interface LivePayload {
  ok: true;
  source: string;
  fetchedAt: string;
  placeId: number;
  universeId: number;
  universeResolved: boolean;
  game: { name: string; playing: number; visits: number; favorites: number; rootPlaceMaxPlayers: number; created: string; updated: string; version: string | null };
  votes: { up: number; down: number; total: number; positivePercent: number | null } | null;
  servers: {
    placeId: number; label: string; servers: number; players: number; capacity: number; capacityPerServer: number | null;
    openSlots: number; complete: boolean; distribution: { label: string; servers: number }[];
  } | null;
  errors: Record<string, string>;
  history: {
    snapshots: number; firstSnapshotAt: string | null;
    previous: { at: string; visits: number; playing: number; favorites: number } | null;
    dayAgo: { at: string; visits: number; favorites: number } | null;
    players24h: [number, number][];
  } | null;
}

export interface Baseline { asOf: string; visits: number; favorites: number }

const ENDPOINT = "/api/live";
const REFRESH_MS = 60_000;
const MANUAL_COOLDOWN_MS = 15_000;
const ROBLOX_URL = "https://www.roblox.com/games/6911148748/Car-Driving-Indonesia";

type Status = "loading" | "live" | "stale" | "error";

function useLive() {
  const [data, setData] = useState<LivePayload | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lastManual = useRef(0);
  const hasData = useRef(false);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) throw new Error(body?.detail || `HTTP ${res.status}`);
      setData(body as LivePayload);
      hasData.current = true;
      setFailure(null);
      setStatus("live");
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Network error");
      setStatus(hasData.current ? "stale" : "error");
    } finally {
      setLastAttempt(Date.now());
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load();
    let timer = window.setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      window.clearInterval(timer);
      load();
      timer = window.setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const refresh = useCallback(() => {
    if (Date.now() - lastManual.current < MANUAL_COOLDOWN_MS) return;
    lastManual.current = Date.now();
    load();
  }, [load]);

  return { data, status, lastAttempt, failure, busy, refresh };
}

/** Smoothly tweens between successive values (instant when reduced motion is preferred). */
function Counter({ value, format = (n: number) => n.toLocaleString("en-US") }: { value: number; format?: (n: number) => string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(start + (value - start) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="tabular">{format(shown)}</span>;
}

const fmt = (n: number) => n.toLocaleString("en-US");
const signed = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toLocaleString("en-US")}`;
function time(iso: string | number) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function dateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function ago(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    loading: { label: "Connecting", dot: "bg-steel", text: "text-silver" },
    live: { label: "Live", dot: "bg-emerald-400", text: "text-emerald-300" },
    stale: { label: "Stale data", dot: "bg-rambu", text: "text-rambu" },
    error: { label: "Unavailable", dot: "bg-merah", text: "text-red-300" },
  }[status];
  return (
    <span className={cx("inline-flex items-center gap-2 font-display text-[0.7rem] font-bold tracking-[0.16em] uppercase [font-stretch:112%]", map.text)}>
      <span className="relative flex size-2">
        {status === "live" && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:hidden" />}
        <span className={cx("relative inline-flex size-2 rounded-full", map.dot)} />
      </span>
      {map.label}
    </span>
  );
}

function StatCard({ label, children, sub, note }: { label: string; children: React.ReactNode; sub?: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-carbon p-5 md:p-6">
      <p className="eyebrow text-steel">{label}</p>
      <div className="display mt-3 text-[clamp(1.9rem,4.2vw,3.1rem)] leading-none">{children}</div>
      {sub && <div className="mt-3 text-[0.8rem] leading-relaxed text-silver">{sub}</div>}
      {note && <div className="mt-auto pt-3 text-[0.7rem] text-steel">{note}</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4" aria-busy="true" aria-label="Loading live statistics">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-carbon p-5 md:p-6">
          <div className="h-3 w-24 animate-pulse bg-white/10" />
          <div className="mt-4 h-10 w-36 animate-pulse bg-white/10" />
          <div className="mt-4 h-3 w-28 animate-pulse bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function Sparkline({ points }: { points: [number, number][] }) {
  if (points.length < 2) return null;
  const w = 600, h = 120, pad = 6;
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (x: number) => pad + ((x - x0) / Math.max(1, x1 - x0)) * (w - pad * 2);
  const sy = (y: number) => h - pad - ((y - y0) / Math.max(1, y1 - y0)) * (h - pad * 2);
  const d = points.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full" role="img" aria-label={`Players online over the last 24 hours, from ${fmt(points[0][1])} to ${fmt(points[points.length - 1][1])}`}>
        <path d={`${d} L${sx(x1)},${h} L${sx(x0)},${h} Z`} fill="currentColor" className="text-merah/10" />
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" className="text-merah" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="mt-2 flex justify-between text-[0.7rem] text-steel tabular">
        <span>{time(points[0][0])} · {fmt(points[0][1])}</span>
        <span>low {fmt(Math.min(...ys))} · high {fmt(Math.max(...ys))}</span>
        <span>{time(points[points.length - 1][0])} · {fmt(points[points.length - 1][1])}</span>
      </figcaption>
    </figure>
  );
}

export function LiveStats({ variant = "compact", baseline }: { variant?: "compact" | "full"; baseline: Baseline }) {
  const { data, status, lastAttempt, failure, busy, refresh } = useLive();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 5_000);
    return () => window.clearInterval(t);
  }, []);

  const g = data?.game;
  const h = data?.history;

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusPill status={status} />
          {data && (
            <span className="text-[0.75rem] text-steel">
              Last updated <time dateTime={data.fetchedAt} className="text-silver tabular">{time(data.fetchedAt)}</time> · {ago(data.fetchedAt, now)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[0.72rem] text-steel">Source: Roblox Public API · refreshes every 60s</span>
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex size-9 items-center justify-center rounded-[3px] border border-white/15 text-silver transition-colors hover:border-white/50 hover:text-paper disabled:opacity-50"
            aria-label="Refresh live statistics"
            title="Refresh"
          >
            <RefreshCw className={cx("size-4", busy && "animate-spin motion-reduce:animate-none")} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6" aria-live="polite">
        {status === "loading" && !data ? (
          <Skeleton />
        ) : status === "error" && !data ? (
          <div className="flex flex-col items-start gap-3 border border-merah/40 bg-merah/5 p-6" role="alert">
            <p className="flex items-center gap-2 font-semibold text-paper">
              <AlertTriangle className="size-5 text-merah" aria-hidden /> Unable to retrieve live data. Please try again later.
            </p>
            <p className="text-sm text-silver">
              No figures are shown, because we never display placeholder numbers.{lastAttempt ? ` Last attempt ${time(lastAttempt)}.` : ""}
              {failure ? <span className="block text-[0.75rem] text-steel">Detail: {failure}</span> : null}
            </p>
            <button type="button" onClick={refresh} className="inline-flex h-10 items-center gap-2 rounded-[3px] bg-paper px-4 text-sm font-semibold text-ink">
              <RefreshCw className="size-4" /> Try again
            </button>
          </div>
        ) : data && g ? (
          <>
            {status === "stale" && (
              <p className="mb-4 flex items-start gap-2 border-l-2 border-rambu bg-rambu/10 p-3 text-sm text-paper" role="status">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rambu" aria-hidden />
                <span>
                  Unable to retrieve live data. Showing the last successful update from {time(data.fetchedAt)} ({ago(data.fetchedAt, now)}).
                  {lastAttempt ? ` Last attempt ${time(lastAttempt)}.` : ""}
                </span>
              </p>
            )}
            <div className={cx("grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4", status === "stale" && "opacity-80")}>
              <StatCard
                label="Players online"
                sub={g.playing > 0 ? "Across every CDID map and the main menu" : "No players reported right now"}
                note={h?.previous ? <>Previous snapshot {fmt(h.previous.playing)} · {ago(h.previous.at, now)}</> : "Live from Roblox"}
              >
                <Counter value={g.playing} />
              </StatCard>
              <StatCard
                label="Total visits"
                sub={
                  <>
                    <span className="block text-paper tabular">{fmt(g.visits)} exactly</span>
                    {h?.dayAgo && <span className="block text-emerald-300 tabular">{signed(g.visits - h.dayAgo.visits)} in about 24 h</span>}
                    {h?.previous && h.previous.visits !== g.visits && <span className="block tabular">{signed(g.visits - h.previous.visits)} since {time(h.previous.at)}</span>}
                    <span className="block tabular">{signed(g.visits - baseline.visits)} since {new Date(baseline.asOf).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} snapshot</span>
                  </>
                }
                note="All-time visits since June 2021"
              >
                <Counter value={g.visits} format={(n) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : fmt(n))} />
              </StatCard>
              <StatCard
                label="Favourites"
                sub={<span className="tabular">{signed(g.favorites - baseline.favorites)} since {new Date(baseline.asOf).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} snapshot</span>}
                note="Players who favourited CDID"
              >
                <Counter value={g.favorites} />
              </StatCard>
              <StatCard
                label="Positive rating"
                sub={data.votes ? <span className="tabular">{fmt(data.votes.up)} likes · {fmt(data.votes.down)} dislikes</span> : "Rating data unavailable right now"}
                note={data.votes ? "Thumbs up ÷ all votes" : data.errors.votes}
              >
                {data.votes?.positivePercent != null ? <><Counter value={Math.round(data.votes.positivePercent * 10)} format={(n) => (n / 10).toFixed(1)} />%</> : <span className="text-steel">—</span>}
              </StatCard>
            </div>

            {variant === "compact" ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
                <p className="text-silver">
                  Game status: <strong className="text-paper">{g.playing > 0 ? "Online, players active" : "No active players reported"}</strong>
                  {g.version && <> · Current version <strong className="text-paper">{g.version}</strong></>}
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link href="/live" className="inline-flex items-center gap-1.5 font-display text-[0.78rem] font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-silver">
                    Full statistics <ArrowRight className="size-4" />
                  </Link>
                  <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-display text-[0.78rem] font-bold tracking-[0.12em] uppercase [font-stretch:112%] hover:text-silver">
                    Roblox page <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            ) : (
              <FullDetails data={data} now={now} lastAttempt={lastAttempt} status={status} />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function FullDetails({ data, now, lastAttempt, status }: { data: LivePayload; now: number; lastAttempt: number | null; status: Status }) {
  const g = data.game;
  const s = data.servers;
  const h = data.history;
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      {/* Game status */}
      <section aria-labelledby="status-h">
        <h3 id="status-h" className="display text-2xl">Game status</h3>
        <dl className="mt-4 divide-y divide-white/10 border-y border-white/10 text-sm">
          {[
            ["Roblox API", status === "live" ? "Responding" : "Not responding — showing last data", "Measured: our server received a valid response"],
            ["Game availability", g.playing > 0 ? "Online (players active)" : "No players reported", "Inferred from the player count; Roblox does not publish an official status"],
            ["Current version", g.version ?? "Not stated in description", "Parsed live from the official game description"],
            ["Game last updated on Roblox", dateTime(g.updated), "Roblox's own 'updated' timestamp"],
            ["Last successful API response", `${dateTime(data.fetchedAt)} (${ago(data.fetchedAt, now)})`, null],
            ["Last refresh attempt", lastAttempt ? time(lastAttempt) : "—", null],
            ["Universe ID", `${data.universeId}${data.universeResolved ? " (resolved from place 6911148748)" : " (known value; resolver unavailable)"}`, null],
          ].map(([k, v, n]) => (
            <div key={k as string} className="grid gap-1 py-3 sm:grid-cols-[13rem_1fr]">
              <dt className="text-steel">{k}</dt>
              <dd>
                <span className="text-paper">{v}</span>
                {n && <span className="block text-[0.72rem] text-steel">{n}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Servers */}
      <section aria-labelledby="servers-h">
        <h3 id="servers-h" className="display flex items-center gap-2 text-2xl"><Server className="size-5 text-steel" aria-hidden /> Server sample</h3>
        {s ? (
          <>
            <p className="mt-2 text-sm text-silver">
              Public servers of the <strong className="text-paper">{s.label}</strong> map (place {s.placeId}){s.complete ? ", every server returned by Roblox." : ", the first 100 servers returned by Roblox."}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
              {[
                ["Active servers", fmt(s.servers)],
                ["Players", fmt(s.players)],
                ["Per server", s.capacityPerServer ? fmt(s.capacityPerServer) : "—"],
                ["Open slots", fmt(s.openSlots)],
              ].map(([k, v]) => (
                <div key={k} className="bg-carbon p-4">
                  <dt className="eyebrow text-steel">{k}</dt>
                  <dd className="display mt-2 text-2xl tabular">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 space-y-2 text-sm" aria-label="Server fill distribution">
              {s.distribution.map((b) => (
                <li key={b.label} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3">
                  <span className="text-steel">{b.label}</span>
                  <span className="h-2 bg-white/5">
                    <span className="block h-2 bg-silver" style={{ width: `${s.servers ? (b.servers / s.servers) * 100 : 0}%` }} />
                  </span>
                  <span className="text-right tabular">{b.servers}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 border border-dashed border-white/15 p-4 text-sm text-silver">Server data is unavailable right now ({data.errors.servers ?? "no response"}). Other statistics are unaffected.</p>
        )}
        <p className="mt-4 flex gap-2 text-[0.75rem] leading-relaxed text-steel">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            CDID&apos;s published place is a single-player main menu: Roblox reports a maximum of {g.rootPlaceMaxPlayers} player per menu server. Players then move into map sub-places,
            whose IDs are not public except Jawa Tengah. So this is a sample of one map, not a census of every server. Individual players are never shown.
          </span>
        </p>
      </section>

      {/* Trend */}
      <section aria-labelledby="trend-h" className="lg:col-span-2">
        <h3 id="trend-h" className="display text-2xl">Players · last 24 hours</h3>
        {h && h.players24h.length >= 2 ? (
          <div className="mt-4 border border-white/10 bg-carbon p-4 text-paper">
            <Sparkline points={h.players24h} />
          </div>
        ) : (
          <p className="mt-3 border border-dashed border-white/15 p-4 text-sm text-silver">
            {h
              ? `Not enough snapshots yet (${h.snapshots} stored since ${h.firstSnapshotAt ? dateTime(h.firstSnapshotAt) : "now"}). The trend appears once at least two snapshots, 10 minutes apart, exist.`
              : "Snapshot history is unavailable in this environment, so live figures still work but trends do not."}
          </p>
        )}
      </section>
    </div>
  );
}
