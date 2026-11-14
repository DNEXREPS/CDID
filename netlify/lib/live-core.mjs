// CDID LIVE — server-side collection of public Roblox statistics.
// Used by the Netlify Function in netlify/functions/live.mjs. Kept framework-free so it can be
// unit-tested locally with a mocked fetch. No credentials are needed or used: every endpoint is public.

export const PLACE_ID = 6911148748; // published place (main menu / lobby)
// Universe resolved from the place ID at runtime. This value (checked 2026-11-14) is used only if the
// resolver endpoint itself is unreachable, so the panel still works; the response says which was used.
export const KNOWN_UNIVERSE_ID = 2640407187;
// The only CDID map sub-place whose ID is publicly documented (Jawa Tengah). The root place only hosts
// single-player menu servers, so map servers are the meaningful view of server capacity.
export const MAP_PLACE = { id: 9508940498, label: "Jawa Tengah" };

const SNAPSHOT_EVERY_MS = 10 * 60 * 1000; // at most one stored snapshot per 10 minutes
const SNAPSHOT_KEEP_MS = 7 * 24 * 60 * 60 * 1000; // keep 7 days

let cachedUniverse = null;

async function getJSON(url, fetchImpl, timeoutMs = 6000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: ctrl.signal, headers: { Accept: "application/json", "User-Agent": "cdid-website-live/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).host}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function resolveUniverse(fetchImpl) {
  if (cachedUniverse) return { id: cachedUniverse, resolved: true };
  try {
    const d = await getJSON(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`, fetchImpl);
    if (typeof d.universeId === "number") {
      cachedUniverse = d.universeId;
      return { id: d.universeId, resolved: true };
    }
  } catch {
    /* fall through */
  }
  return { id: KNOWN_UNIVERSE_ID, resolved: false };
}

export function parseVersion(description) {
  const m = /\bV(\d+(?:\.\d+){0,3})\s*Changelogs?\b/i.exec(description ?? "");
  return m ? `V${m[1]}` : null;
}

export function summariseServers(list, hasMore) {
  const servers = list.map((s) => ({ playing: Number(s.playing) || 0, max: Number(s.maxPlayers) || 0 }));
  const players = servers.reduce((a, s) => a + s.playing, 0);
  const capacity = servers.reduce((a, s) => a + s.max, 0);
  const maxPer = servers.reduce((a, s) => Math.max(a, s.max), 0);
  const buckets = [
    { label: "Full", min: 1, max: 1 },
    { label: "75–99%", min: 0.75, max: 0.9999 },
    { label: "50–74%", min: 0.5, max: 0.7499 },
    { label: "25–49%", min: 0.25, max: 0.4999 },
    { label: "Under 25%", min: 0, max: 0.2499 },
  ].map((b) => ({
    label: b.label,
    servers: servers.filter((s) => s.max > 0 && s.playing / s.max >= b.min && s.playing / s.max <= b.max).length,
  }));
  return {
    placeId: MAP_PLACE.id,
    label: MAP_PLACE.label,
    servers: servers.length,
    players,
    capacity,
    capacityPerServer: maxPer || null,
    openSlots: Math.max(0, capacity - players),
    complete: !hasMore,
    distribution: buckets,
  };
}

/** Fetch everything from Roblox. Throws only if the core game statistics are unavailable. */
export async function collect({ fetchImpl = fetch, now = () => new Date() } = {}) {
  const universe = await resolveUniverse(fetchImpl);
  const [gamesR, votesR, serversR] = await Promise.allSettled([
    getJSON(`https://games.roblox.com/v1/games?universeIds=${universe.id}`, fetchImpl),
    getJSON(`https://games.roblox.com/v1/games/votes?universeIds=${universe.id}`, fetchImpl),
    getJSON(`https://games.roblox.com/v1/games/${MAP_PLACE.id}/servers/Public?limit=100&sortOrder=Desc&excludeFullGames=false`, fetchImpl),
  ]);
  if (gamesR.status !== "fulfilled") throw new Error(`Roblox Games API unavailable: ${gamesR.reason?.message ?? gamesR.reason}`);
  const g = gamesR.value?.data?.[0];
  if (!g || typeof g.playing !== "number") throw new Error("Roblox Games API returned no data for this universe");

  const errors = {};
  let votes = null;
  if (votesR.status === "fulfilled" && votesR.value?.data?.[0]) {
    const v = votesR.value.data[0];
    const total = (v.upVotes ?? 0) + (v.downVotes ?? 0);
    votes = { up: v.upVotes ?? 0, down: v.downVotes ?? 0, total, positivePercent: total ? Math.round((v.upVotes / total) * 1000) / 10 : null };
  } else errors.votes = votesR.reason?.message ?? "No vote data";

  let servers = null;
  if (serversR.status === "fulfilled" && Array.isArray(serversR.value?.data)) {
    servers = summariseServers(serversR.value.data, Boolean(serversR.value.nextPageCursor));
  } else errors.servers = serversR.reason?.message ?? "No server data";

  return {
    ok: true,
    source: "Roblox Public API",
    fetchedAt: now().toISOString(),
    placeId: PLACE_ID,
    universeId: universe.id,
    universeResolved: universe.resolved,
    game: {
      name: g.name,
      playing: g.playing,
      visits: g.visits,
      favorites: g.favoritedCount,
      rootPlaceMaxPlayers: g.maxPlayers,
      created: g.created,
      updated: g.updated,
      version: parseVersion(g.description),
    },
    votes,
    servers,
    errors,
  };
}

/** Store a snapshot (max one per 10 min) and derive deltas. `store` is a Netlify Blobs store. */
export async function withHistory(payload, store, nowMs = Date.now()) {
  let points = [];
  try {
    const raw = await store.get("snapshots", { type: "json" });
    if (Array.isArray(raw)) points = raw;
  } catch {
    points = [];
  }
  points = points.filter((p) => p && nowMs - p.t <= SNAPSHOT_KEEP_MS).sort((a, b) => a.t - b.t);
  const last = points[points.length - 1];
  const previous = last ?? null;
  if (!last || nowMs - last.t >= SNAPSHOT_EVERY_MS) {
    points.push({ t: nowMs, playing: payload.game.playing, visits: payload.game.visits, favorites: payload.game.favorites });
    await store.setJSON("snapshots", points);
  }
  const dayAgo = points.find((p) => nowMs - p.t <= 24 * 3600 * 1000 && nowMs - p.t >= 20 * 3600 * 1000) ?? null;
  const last24 = points.filter((p) => nowMs - p.t <= 24 * 3600 * 1000);
  return {
    snapshots: points.length,
    firstSnapshotAt: points[0] ? new Date(points[0].t).toISOString() : null,
    previous: previous ? { at: new Date(previous.t).toISOString(), visits: previous.visits, playing: previous.playing, favorites: previous.favorites } : null,
    dayAgo: dayAgo ? { at: new Date(dayAgo.t).toISOString(), visits: dayAgo.visits, favorites: dayAgo.favorites } : null,
    players24h: last24.map((p) => [p.t, p.playing]),
  };
}
