# CDID Research Report

**Subject:** Car Driving Indonesia (CDID), Roblox place `6911148748`, universe `2640407187`
**Developer:** CDID Studio Official Group (Roblox community `10884667`, verified)
**Research date:** 14 November 2026
**Scope:** Research for an independent, official-style CDID website. Every fact on the site maps to an entry in `data/sources.json`.

---

## 1. Sources investigated

| # | Source | Type | Accessed how | Result |
|---|--------|------|--------------|--------|
| 1 | Roblox Games API: universe 2640407187 | Official | `games.roblox.com/v1/games` | ✅ Full description, V2.8 changelog, created/updated dates, visits, favourites, genre |
| 2 | Roblox Votes API | Official | `games.roblox.com/v1/games/votes` | ✅ 169,296 up / 26,519 down |
| 3 | Roblox Game Passes API | Official | `apis.roblox.com/game-passes/v1/...` | ✅ 14 passes, prices, descriptions, sale status |
| 4 | Roblox Media and Thumbnails API | Official | `games.roblox.com/v2/games/.../media` and `thumbnails.roblox.com` | ✅ 7 screenshots (768×432), icon, pass icons and group icon downloaded to `public/images/media` |
| 5 | Roblox Groups API: 10884667 | Official | `groups.roblox.com/v1/groups/10884667` | ✅ Owner `Pengemudiindonesiaa`, 453,300 members, verified |
| 6 | Roblox Universes API: place 9508940498 | Official | `apis.roblox.com/universes/v1/places/...` | ✅ "Jawa Tengah" place belongs to the CDID universe |
| 7 | Roblox experience social links | Official | `games.roblox.com/v1/games/.../social-links/list` | ❌ Requires authentication |
| 8 | Discord invite API: `cdid` and 4 other invite codes found online | Official | `discord.com/api/v10/invites/{code}` | ✅ All resolve to guild `809316712901640203`, "CDID Official Server", vanity `cdid`, ≈330,592 members |
| 9 | Discord channels (announcements, changelogs) | Official | n/a | ❌ **Not accessed.** Needs a logged-in Discord account; see §9 |
| 10 | Search-engine snapshots of the Roblox page | Official (archived) | Web search | ⚠️ Older changelog wording for V1.9, V2.0, V2.3, V2.4, V2.5.5, V2.6, V2.6.5, V2.7 and V2.7.5. Dates approximate |
| 11 | CDID Wiki (Fandom) | Community | MediaWiki API | ✅ Cars, Limited Cars (V0.3–V2.8), Map, Jobs, Passes, Updates, Building, Commands, and 1,052 car articles |
| 12 | The CDID Database (Unofficial), cdidrepo.vercel.app | Community | Embedded page data | ✅ 2,796 vehicle records with price, engine, dealership key, gamepass, limited, removed/event/minigame flags and thumbnail URL |
| 13 | Place 10495064072 ("Car Driving Indonesia (New Update)") | Community / unrelated | Roblox API | ⚠️ A copy by user MickyNoLimit, **not official**. Its description preserves the official V1.2.5 changelog text |
| 14 | Instagram @cdidstudios, TikTok @cdidstudiodevelopment | Official (self-described) | Web search only | ⚠️ Profile text says "official"; hosts not reachable from the research environment |
| 15 | NamuWiki, Rolimons, RoTrends, third-party code and guide sites | Community / aggregator | Web search only | ⚠️ Used only to cross-check. Not used as sole evidence for anything on the site |

## 2. Discord information accessed

- **Verified:** the official invite `https://discord.gg/cdid` resolves to *CDID Official Server* (guild ID `809316712901640203`), described by Discord as "Official Roblox Car Driving Indonesia Discord server." It had about 330,592 members and 19,691 online at the time of access. Four other invite codes circulating online (`CCxGXsUpYh`, `sGGYScVnvr`, `hrqmudhyZv`, `24MA2cbJ9B`) resolve to the same guild.
- **Not accessed:** no channel names, announcements, changelogs or developer statements were read. The site does not quote or paraphrase any Discord message.

## 3. Vehicles verified

- **2,796** vehicle records imported from the CDID Repo database, last updated 13 Nov 2026.
  - 2,438 currently sold at a dealership
  - 244 removed (legacy)
  - 79 event-only
  - 35 minigame-box-only
- **2,156** records matched to a CDID Wiki car article, adding body style, transmission, drivetrain and real-life counterpart. These are labelled *Community verified*. The other **640** are labelled *Partially verified*.
- **480** vehicles linked to the update that introduced them, from the wiki's per-version limited-car log.
- **Horsepower: not verified for any vehicle.** No accessible source publishes in-game horsepower. The field exists in the schema but always shows "Not verified".
- **Categories:** assigned only when the wiki states a body style (827 vehicles). The rest show "Unclassified" rather than a guess.
- **Images:** 2,757 in-game thumbnails (250×250) downloaded and converted to WebP. 39 thumbnails had expired on Roblox's CDN and show a placeholder.

## 4. Dealerships verified

25 dealerships, all keyed from the community database's dealership field. In-game names come from the wiki.

- **Location partly verified (wiki Map article, last edited 21 Jul 2025):**
  - Jakarta: Tokoma, Liaxe, Mestibis, Buffermacht/BMR, Murceso-Venz, Hyunson, Wuliuz
  - Bekasi: Komercial, Hyunson, CIA, Sumber Jaya
  - Bandung: Honade, Sanziky, Otnas Esprit Works, Sumber Jaya branch
  - Ciawi: Densu
- **Location not verified:** Premium, Retro Cars, Atruse-Weltwagen, Naisen, Mizada, SLM, DIR, Citrus, Haekoo, Shehua, Shufu.
- **No in-game coordinates were found in any source, so none are published.** The locator uses map region, city and landmarks instead.

## 5. Update history verified

| Version | Status | Evidence | Date confidence |
|---|---|---|---|
| V2.8 | Released, current | Official Roblox description (live API) | Listing updated 2026-11-13 |
| V2.7.5, V2.7, V2.6.5, V2.6, V2.5.5, V2.4, V2.3, V2.0, V1.9 | Released | Official wording via search snapshots | Approximate, inferred from event names or snapshot dates |
| V2.2.0 | Released | Wiki copy of the changelog, with 17AGUSTUS2025 codes | Approximate (Aug 2025) |
| V1.2.5 | Released | Official text preserved on an unofficial copy | Approximate (Aug 2023, HUT RI 78) |
| V2.5, V2.4.0.5, V2.1, V1.9.8, V1.9.5, V1.8 – V0.3 | Released | Version numbers and limited cars from the wiki log only | Unknown |

**V2.8 lead check:** every item in the brief's research lead (92 new and reworked cars, Halloween Event 2026, reworked Office Job, Bali Phase 1 refresh, new gacha system, bug fixes) matches the live official description word for word. V2.8 is still the latest version on the access date.

No upcoming, announced or rumoured update could be verified, so the Updates page shows an empty state for those statuses.

## 6. Social accounts verified

| Platform | Account | Status |
|---|---|---|
| Discord | discord.gg/cdid | **Official, verified** through the invite API |
| Roblox experience | place 6911148748 | **Official, verified** |
| Roblox group | CDID Studio Official Group (10884667) | **Official, verified** (Roblox verified badge) |
| Instagram | @cdidstudios | Official (self-described); partially verified |
| TikTok | @cdidstudiodevelopment | Official (self-described); partially verified |
| YouTube | none found | No official channel could be confirmed, so none is listed |
| X / Twitter | @OCDIDRP | Roleplay community account, **not** the studio; not listed as official |

## 7. Conflicting information

- **Car count.** Third-party guides cite "50+" or "150+" cars, while the community database has 2,796 records, including removed ones. The site uses the database count and separates out removed cars.
- **"Current version".** Some guides say V2.7.5 is current; the live Roblox description shows V2.8. The official source wins.
- **Creator attribution.** One SEO site credits "ilmzh". The Roblox group owner (official) and the wiki both point to Pengemudiindonesiaa ("shad"), which the site uses.
- **Brand names.** Older cars use earlier in-game names (BMR, Henry-Rolls, Murcezo-Venz) alongside newer ones (Buffermacht, KingsMann, Murceso-Venz). Spelling variants are normalised; genuinely different names are kept.
- **Tyre modification** appears in both the V2.2.0 and V2.3 changelogs. Both are reported as written.

## 8. Missing information

- Horsepower and top speed for every vehicle
- Exact release dates for all versions except V2.8's listing date
- In-game coordinates for every dealership, and locations for 11 dealerships
- Locations of the Gowes, Silambat, Truck and Office jobs, and pay for most jobs
- Gacha odds, cost and prize pool (V2.8)
- Map details for Jawa Timur and Bali beyond the city names
- Changelog texts for V2.5, V2.4.0.5, V2.1, V1.9.5, V1.9.8 and all builds before V1.9 except V1.2.5

## 9. Research limitations

1. **Discord content is behind login.** The research environment has no Discord account, so announcement channels could not be read. Membership and server identity were verified.
2. **Network policy.** Some hosts (NamuWiki, third-party guides, Instagram and TikTok) were only reachable through search-engine summaries.
3. **Snapshot dates are not release dates.** Search-engine copies of the Roblox description show when a page was indexed, not when an update shipped.
4. **Community data can lag.** Prices and availability change with weekly drops. Every record shows its last-verified date (2026-11-14).
5. **Thumbnails expire.** Roblox CDN URLs last 180 days, so images were copied into the repository instead of hot-linked.

## 10. Raw snapshots

`research/raw/` holds the unmodified inputs used to build `/data`:

- `roblox-game.json`
- `cdidrepo-cars.json`
- `wiki-car-infoboxes.json`
- `wiki/*.txt`

Re-run `python3 scripts/build_data.py` to regenerate the vehicle datasets.

---

# Addendum — 14 November 2026: history, dealerships, live statistics

## A. Historical archive (`/archive`, `data/archive.json`)

### Method
- **Official records:** Roblox APIs were queried for every account, group and place connected to CDID: places owned by group 7069915 and by users 254673003, 2206427820, 2584360064 and 2309163393; group descriptions and roles; universe records; and thumbnails. Raw responses are in `research/raw/history/`.
- **Period footage:** found through search-engine listings of YouTube videos. Video IDs and titles come from those listings. The videos are embedded click-to-play as clearly labelled community footage, and we did not view them ourselves.
- **Not reachable:** the Internet Archive (Wayback Machine), YouTube pages, and Discord channels. The research environment's network policy could not be extended (the change was rejected), and Discord channels need a login.

### Key findings
| Finding | Evidence | Level |
|---|---|---|
| Account `pengemudiindo` (254673003) published Indonesian driving places from 23 Apr 2020 (City of Snow Shoreside), plus Bolivia Death Road (14 Jun 2020, "The next Indonesian Death Road") and "old cdid" (25 Nov 2020) | Roblox Games API | Officially confirmed |
| GrandMini Games Studio (group 7069915, owner `pengemudiindo`) describes itself as the "Car Driving Indonesia Official Group". Its first place was created 25 Jul 2020; all its places are now deleted, last updated 17 May 2021 | Roblox Groups and Games APIs | Officially confirmed (records). The contents of the deleted places are unknown |
| ~~V4 changelog place 6267849935 treated as the V4 record~~ **Corrected 14 Nov 2026:** the original classic CDID was place 5896294709 (see Addendum 2). Place 6267849935 is a separate V4-labelled copy (owner xxblueknighgxx, created 19 Jan 2021, 216,610 visits) whose changelog text is not necessarily the original's | Roblox Games API | Verified as *not* the original |
| Classic builds V2.5, V3.3 (Village Edition) and V3.5 survive as places published by Hariaall, who holds the Developer role in CDID Studio Official Group and is Co-Owner of GrandMini | Roblox APIs; community "Evolution of CDID" videos list V1, V2.5, V3.3, V3.5, V4, then Revamp | Multiple independent sources |
| Earliest build: "oldest cdid i could ever find in my folder" ("indonesia death road/ ndesovania"), uploaded 28 Apr 2021 | Roblox Games API and thumbnails | Community-reported |
| Revamp: old places taken down 17 May 2021; new experience created 5 Jun 2021 01:58 UTC under CDID Studio Official Group; first passes the same day; versions restart at V0.x | Roblox APIs; wiki limited log | Officially confirmed |
| V0.6 (≈ Jun–Jul 2022): Jawa Tengah phase 1, 114 vehicles, new menu, modification system, Rare Imports pass (created 28 Jun 2022) | Guides plus the official pass creation date | Multiple independent sources |
| Motorcycles in classic CDID | A screenshot contributed by the site owner (14 Nov 2026) shows a classic buy menu with a 'MotorBike' category (Vario, PC-X) below real-brand cars ('2008 Toyota Vios Taxi'). Its origin and version are not documented. A video title also links to the removed place 5896294709. No changelog or developer source mentions motorcycles, and there are none in the current catalogue | Community-reported |

### Not found
- Any 2019 activity.
- Exact release dates for V1–V4.
- Classic-era dealership locations, menus and vehicle lists.
- V3.5 media: Roblox no longer serves its thumbnails, so the site shows a placeholder.

### Media
The 17 images in `public/images/archive/` were downloaded from Roblox's thumbnail service for the places above. They are shown with their place ID and uploader. No image was created or edited.

## B. Dealerships: Jawa Tengah, Jawa Timur and other regions
- **Checked:** the wiki's Map, Cars and Jobs pages and all 1,052 car articles (searched for every Central and East Java city name); cardrivingindonesia.wiki; and Indonesian- and English-language web searches.
- **Result:** no written or official source names a dealership in **Jawa Tengah, Jawa Timur or Bali**.
  - "Tegal Tuning Systems" is a tuned-car trim name, not a location.
  - "Komersialcdid" is a fan roleplay Instagram account, not an in-game showroom.
  - Three community video tours exist (V1.7-era and later) but could not be viewed. They are linked as "not transcribed".
- **Outcome:** no records were invented. Each region now shows its verified dealerships, or "None verified yet" with the explanation and the video links.
- **Other regions:** reviewed and unchanged. Bandung entries still carry the warning that they predate the V2.7 rebuild.

## C. CDID Live (`/live`, homepage section)
- **Endpoints (all public, no credentials):**
  - `apis.roblox.com/universes/v1/places/6911148748/universe`, which resolves the universe ID 2640407187 (it differs from the place ID)
  - `games.roblox.com/v1/games?universeIds=…`: players online, visits, favourites, last update, description (current version is parsed from it)
  - `games.roblox.com/v1/games/votes?universeIds=…`: thumbs-up and thumbs-down counts, both public, so the positive percentage is derived
  - `games.roblox.com/v1/games/9508940498/servers/Public`: the Jawa Tengah map's servers (50 players each)
- **Root place servers:** the root place 6911148748 only lists single-player menu servers (Roblox reports maxPlayers 1). Other map sub-place IDs are not public, so the site shows a labelled one-map sample rather than a game-wide server count.
- **Rate limits:** the servers endpoint returned HTTP 429 after a few rapid calls. The function therefore calls each endpoint at most once per cache period.
- **Architecture:** Netlify Function `/api/live` with a 60-second durable CDN cache, plus Netlify Blobs snapshots at most every 10 minutes (kept for 7 days). Both are included in Netlify Free, and no secrets are needed.
- **Tested:**
  - with real Roblox data
  - with a simulated total outage (error message, no numbers)
  - with partial 429 failures (affected panels marked unavailable)
  - with a failure after successful loads (stale label and last good data)
  - snapshot storage against the official `@netlify/blobs` local server
  - Netlify build bundling (route `/api/live`, Node 22, blobs included)
- **Not tested here:** `netlify dev` could not run because it needs `dl.deno.land`, which is blocked here.


---

# Addendum 2 — 14 November 2026: the disappearance of CDID V4 (May 2021)

## Access
| Source | Status |
|---|---|
| TikTok https://vt.tiktok.com/ZSp4FHdtQ/ (@beeforiel), supplied by the site owner as the primary lead | **Not accessed.** TikTok is blocked here (proxy 403, and the network allowlist could not be extended). Video, caption, date and comments were **not** reviewed. Search listings only show that @beeforiel ("Beef") posts CDID and Indonesia Driver clips. |
| Farrelpee blog, "Sejarah evolusi cdid" (Sept 2024) | Host blocked; read via search-engine summaries only |
| YouTube "CDID DI COPY SI LEMON" (UfK2Bplqx_w), "CDID and indonesia without lemon" (pVldxWhTwa4) | Titles and descriptions via search listings; not viewed |
| Instagram, Facebook, X, Discord | Not reachable, or nothing relevant indexed |
| Roblox Games, Groups and Thumbnails APIs | Accessed. Raw responses saved in `research/raw/history/` |

## Findings
1. **The original classic CDID is place 5896294709** (universe 2110495097). It is titled "(CLOSED) Car Driving Indonesia" with the description "We're closing for a moment, Sorry!".
   - Owner: pengemudiindo (254673003). Created 2020-10-30; `updated` 2025-03-07.
   - 5,534,986 visits, 24,195 favourites, 4,404 up / 1,005 down votes.
   - A single-universe API lookup returns "[TITLE UNAVAILABLE]"; a multi-universe lookup returns the full record, reproduced three times. **Verified.**
2. **V4.5 media.** The place's icon is "CDID V4.5", and eight promotional images are still served. Roblox asset IDs are one global sequence, so the images can be dated against known places:
   - The V4.5 images (IDs 6779490590–6779625497) fall after place 6738228104 (created 2021-04-28) and before the GrandMini places created on 2021-05-17.
   - The earlier images (IDs 6583977622–6657643476) date to about late March – mid April 2021.
   - **Verified, by inference from asset IDs.**
3. **17 May 2021.** That day the GrandMini group's July 2020 place was last updated, three new group places were created and updated (all four are now deleted), and pengemudiindo's last public place was updated. **The date is verified by Roblox records.** The original place's own closure date is not public.
4. **Place 6267849935 is not the original.** Its owner (xxblueknighgxx) is still active and the place is still public: 216,610 visits, 58 up / 278 down votes. Its "CDID V4" icon is an earlier version of the original's V4.5 artwork. The site owner identifies it as the "Grandmini" duplicate, but it was created four months before 17 May and was never removed. **Its link to "Lemon" is unverified.**
5. **GrandMini Games Studio** (group 7069915) is owned by pengemudiindo, the original game's owner, and Hariaall (CDID Studio Developer) is its Co-Owner. This **conflicts** with the owner's context that "Grandmini" is the duplicate. It is recorded as **Disputed**.
6. **Account deletion.** The Roblox Thumbnails API returns "Blocked" for pengemudiindo's avatar, a moderation indicator; the other accounts are normal. We could not establish which account the report refers to, or when and why. **Unverified.** No inference of responsibility is drawn.
7. **The Lemon allegation** comes from the 2024 blog and two period video descriptions. One description names a Roblox account; that accusation is unverified and deliberately not reproduced. No developer statement, Roblox record or archive of the duplicate was found. **Community report.** Lemon's identity: **Unknown**.
8. **V5.**
   - The new game was created on 2021-06-05 under CDID Studio Official Group. Its owner's display name is "Pengemudiindo", and Hariaall is Developer. **Verified.**
   - The developers use "V5" as an era name: the official "V5 Nostalgia 2026" event and 20 "[V5 Nostalgic Edition]" cars. **Verified.**
   - That this relaunch is the community's "CDID V5" (bigger map, island, ferry): **Community report.**
   - That V5 was a response to the V4 disappearance: **Unverified.**
9. **Origins.** The blog says the project began in 2019 as "Esofania" by "beforiest". **Community report**; no 2019 Roblox record was found. The blog's statements about the individuals' family relationship and ages are private details and are not republished.

## Records corrected
- Archive: the "CDID V4" exhibit now uses the original place's V4.5 media. Place 6267849935 is labelled a separate V4-labelled copy everywhere (places register, sources, chapter). The GrandMini entry is marked Disputed with both positions. The generic "old places taken down" entry is replaced by the chapter. Place 5896294709 is now identified as the original (it was previously "Unknown/Unavailable").
- About timeline and intro: the classic era now starts with the original place (30 Oct 2020), "The disappearance of CDID V4" replaces the generic shutdown entry, and the relaunch notes the community's "V5" name.
