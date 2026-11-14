# Updating content

All content lives in `/data`. You never need to edit a React component to change facts on the site.

> **Rule of thumb:** every fact needs a source. Add the source to `data/sources.json` first, then reference its `id`.

## 1. Add a source

Append an entry to `data/sources.json`:

```json
{
  "id": "src-discord-v29-announcement",
  "title": "CDID Official Server — #announcements, V2.9 release",
  "url": "https://discord.com/channels/809316712901640203/…",
  "sourceType": "official",
  "publisher": "CDID Studio",
  "publicationDate": "2026-12-20",
  "accessDate": "2026-12-21",
  "reliability": "official",
  "notes": "What this source confirms."
}
```

## 2. Publish a new game update

1. Read the new changelog from the Roblox page description, either on the experience page or through `https://games.roblox.com/v1/games?universeIds=2640407187`.
2. Add a new object at the **top** of `data/updates.json`:
   - Paste each changelog line exactly as written into `officialText`.
   - Group the same lines under `changelog.vehicles`, `maps`, `features`, `jobs`, `events`, `gameplay` and `fixes`.
   - Set `status`: `released` for live updates, `announced` or `upcoming` for officially teased ones, `rumored` or `unverified` for leaks. Rumours are shown separately and never as released.
   - Set `dateConfidence` to `exact` only if you have the real release date.
3. Update `data/game.json`: `currentVersion`, `lastUpdated`, and refresh the `stats` snapshot.
4. Optionally add a milestone to `data/timeline.json`.

## 3. Refresh the vehicle catalogue

The catalogue is generated from research snapshots:

```bash
# 1. Replace the raw snapshots (see research/RESEARCH_REPORT.md §10 for how they were captured)
#    research/raw/cdidrepo-cars.json        ← vehicle records
#    research/raw/wiki-car-infoboxes.json   ← wiki car infoboxes
#    research/raw/wiki/Cars.txt, Limited_Cars.txt
# 2. Regenerate the datasets
python3 scripts/build_data.py
# 3. Check that everything links up
npm run validate:data
```

New vehicle thumbnails go in `public/images/vehicles/<sourceRecordId>.webp` (250×250 WebP with a transparent background). The builder only links an image if the file exists.

### Correcting one vehicle by hand

Edit the record in `data/vehicles.json`, then run `python3 scripts/build_data.py` again **only if** you have also updated the raw inputs. Otherwise your edit would be overwritten. For permanent manual fixes, add them as a post-processing step at the end of `scripts/build_data.py`, keyed by `id`.

## 4. Dealerships

Edit `data/dealerships.json`. When you confirm a location in-game:

- set `mapName`, `city`, `locationDescription` and `nearbyLandmarks`;
- upgrade `verificationStatus` (for example to `official` if it comes from a developer screenshot or announcement);
- update `lastVerified`;
- leave `coordinates` as `null` unless the game exposes real map coordinates. If it does, also update the check in `scripts/validate-data.mjs`.

## 5. Social links, game passes and guides

- `data/social.json`: set `officialStatus` to `official` only for accounts confirmed by CDID Studio.
- `data/gamepasses.json`: refresh from `https://apis.roblox.com/game-passes/v1/universes/2640407187/game-passes?passView=Full`.
- `data/guides.json`: guides are typed blocks (`p`, `note`, `list`, `steps`, `table`, `link`, `gamepasses`). Add a new guide object and it gets its own page at `/guides/<id>`.

## 6. Ship it

```bash
npm run build   # validates data, then builds every page statically
git add -A && git commit -m "content: V2.9 update" && git push
```

Netlify rebuilds and redeploys automatically on every push to the connected branch.

## 7. Historical archive

Exhibits are in `data/archive.json`:
- `eras`: the four eras.
- `entries`: each has a date or label, a date confidence, a version, a description, `media` and `sourceIds`.
- `verification`: one of `official`, `multiple`, `community`, `partial` or `unconfirmed`.
- `media` items are `image` (a file in `public/images/archive/`), `youtube` (`videoId`) or `unavailable` (a caption explaining what is missing). Never add a recreated or AI-generated image.
- `comparisons` drive the before/after sliders. `gaps` lists what remains unverified.

The validator checks that every image file exists and every source ID resolves.

## 8. CDID Live

There is no content to maintain: figures come live from Roblox. If CDID publishes another map sub-place ID, you can sample that map instead by changing `MAP_PLACE` in `netlify/lib/live-core.mjs`.
