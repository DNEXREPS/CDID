# Car Driving Indonesia (CDID) — official-style website

An independent, research-backed website for **Car Driving Indonesia**, the Roblox driving and roleplay experience by CDID Studio Official Group (place `6911148748`). It is styled like an official game site; every fact comes from a cited source, and anything unverified is labelled.

> **Independent project.** This site is not owned, operated or endorsed by CDID Studio or Roblox Corporation. The footer on every page says so.

## What's inside

| Page | Route | Highlights |
|---|---|---|
| Home | `/` | Cinematic hero with Play, Explore and Discord CTAs; latest update; featured vehicles and dealerships; world regions; game facts; Discord band |
| About | `/about` | Story of CDID plus a sourced timeline with year navigation and per-entry sources |
| Vehicles | `/vehicles` | 2,796 vehicles. Search, eight filters, five sorts, URL-synced state, loading, empty and error states, mobile filter drawer |
| Vehicle detail | `/vehicles/[id]` | Showroom render, price, specs ("Not verified" where unknown), dealership, game pass, release window, sources |
| Dealerships | `/dealerships` | Locator with a region route schematic, search, manufacturer and map filters, live detail panel, regions and landmarks |
| Dealership detail | `/dealerships/[id]` | Location, landmarks, price range, stock |
| Updates | `/updates` | Patch notes from V0.3 to V2.8, status tabs, expandable changelogs, limited-vehicle lists, approximate-date labels |
| Guides | `/guides`, `/guides/[id]` | 11 guides with search and category filter |
| Community | `/community` | Verified official channels kept separate from community resources |
| Sources | `/sources` | Full source register, verification labels and known limitations |

## Tech stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**, built as a **static export**: about 2,850 pre-rendered pages written to `out/` and served from a CDN with no server functions
- **Tailwind CSS 4** with design tokens in `app/globals.css`
- **Lucide** icons; Archivo (expanded display) and Inter (text) self-hosted through Fontsource
- No database is required: content is JSON in `/data` behind a small data-access layer, ready to move to Supabase or Postgres (see `docs/DATABASE.md`)

## Project structure

```
app/                 routes (pages, /api/vehicles.json static data file, sitemap, robots, 404, error, loading)
components/          UI: header, footer, catalogue, locator, update feed, cards, badges, sources
lib/                 types.ts (entities), data.ts (data access), catalogue.ts (filter/sort), format.ts
data/                all site content as JSON (vehicles, dealerships, updates, sources, …)
public/images/       vehicle renders (WebP) and official screenshots and icons
research/            RESEARCH_REPORT.md and raw source snapshots
scripts/             build_data.py (ETL from snapshots), validate-data.mjs (integrity checks)
docs/                DATABASE.md (schema), UPDATING.md (content workflow)
```

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # validates /data, then exports the static site to out/
npx serve out        # preview the exported site (any static file server works)
npm run lint         # TypeScript type-check
npm run validate:data
```

Regenerating the vehicle dataset from the research snapshots needs Python 3: `python3 scripts/build_data.py`.

## Environment variables

**None are required.** The site has no API keys, secrets or database credentials.

| Variable | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical URL used in metadata, `sitemap.xml` and `robots.txt`, e.g. a custom domain. If it isn't set, the site uses `URL`. |
| `URL` | Set automatically by Netlify | Your site's main Netlify address. Do not add it yourself. |

## Deploy to Netlify (free plan)

The project is configured in `netlify.toml`:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `out` |
| Node version | 22 (set in `netlify.toml`) |
| Functions | None: the site is entirely static |

Netlify detects Next.js and runs its official Next.js runtime (`@netlify/plugin-nextjs`), which supports static exports and publishes `out/` as-is. No serverless or edge functions are created, so the site stays well within Netlify Free.

Dashboard steps:
1. On app.netlify.com, choose **Add new project → Import an existing project → GitHub**.
2. Select `dnexreps/cdid` and the branch `claude/dreamy-fermi-zae3cd`.
3. Check that the build command is `npm run build` and the publish directory is `out` (both are pre-filled from `netlify.toml`).
4. Click **Deploy**.

`vercel.json` is left over from an earlier Vercel setup. Netlify ignores it.

## Research & accuracy

Read `research/RESEARCH_REPORT.md` for what was verified, how, and what wasn't. In short:

- **Official sources, read directly:** the Roblox Games, Game Passes, Thumbnails and Groups APIs, and the Discord invite API.
- **Community sources, labelled as such:** the CDID Fandom wiki and The CDID Database (cdidrepo).
- **Not accessed:** Discord channel content, which needs a login. Nothing on the site is quoted from Discord.
- **Never invented:** horsepower (unpublished), in-game coordinates (unpublished), and exact dates for most older versions (labelled approximate).

## Updating content

See `docs/UPDATING.md` for adding an update, refreshing vehicles, verifying a dealership location, or adding a guide.
