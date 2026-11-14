// Netlify Function: GET /api/live — public Roblox statistics for CDID.
//
// - Roblox is called server-side (Roblox APIs do not allow browser CORS requests).
// - The response is cached on Netlify's CDN for 60 s (shared by all visitors), so Roblox receives
//   at most about one request per minute regardless of traffic. This keeps well within Roblox rate
//   limits and Netlify Free usage.
// - Snapshots are stored in Netlify Blobs (included on the free plan) at most every 10 minutes, so the
//   site can show change since the previous snapshot and a 24-hour player trend.
// - No API keys or secrets are used.
import { getStore } from "@netlify/blobs";
import { collect, withHistory } from "../lib/live-core.mjs";

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });

export default async () => {
  try {
    const payload = await collect();
    try {
      payload.history = await withHistory(payload, getStore("cdid-live"));
    } catch (e) {
      payload.history = null;
      payload.errors.history = "Snapshot storage unavailable";
    }
    return json(payload, 200, {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=60, stale-while-revalidate=300",
    });
  } catch (e) {
    return json(
      { ok: false, error: "Unable to retrieve live data. Please try again later.", detail: String(e?.message ?? e), fetchedAt: new Date().toISOString() },
      502,
      { "Cache-Control": "no-store", "Netlify-CDN-Cache-Control": "no-store" },
    );
  }
};

export const config = { path: "/api/live" };
