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
