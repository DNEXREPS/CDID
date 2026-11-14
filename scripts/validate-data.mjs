#!/usr/bin/env node
// Validates the JSON content in /data: required fields, enums, unique ids and relational references.
// Run: npm run validate:data   (also runs automatically before `npm run build`)
import { readFileSync } from "node:fs";

const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), "utf8"));
const errors = [];
const err = (m) => errors.push(m);

const sources = load("sources.json");
const vehicles = load("vehicles.json");
const dealerships = load("dealerships.json");
const updates = load("updates.json");
const social = load("social.json");
const guides = load("guides.json");
const regions = load("regions.json");
const timeline = load("timeline.json");
const gamepasses = load("gamepasses.json");

const VERIFICATION = ["official", "community", "partial", "unverified"];
const sourceIds = new Set(sources.map((s) => s.id));
const dealerIds = new Set(dealerships.map((d) => d.id));
const passIds = new Set(gamepasses.map((g) => g.id));
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function unique(list, label) {
  const seen = new Set();
  for (const x of list) {
    if (!x.id) err(`${label}: record without id`);
    else if (seen.has(x.id)) err(`${label}: duplicate id "${x.id}"`);
    seen.add(x.id);
  }
}
function refs(list, label, key = "sourceIds") {
  for (const x of list) {
    if (!Array.isArray(x[key]) || x[key].length === 0) err(`${label} "${x.id}": needs at least one source`);
    for (const s of x[key] ?? []) if (!sourceIds.has(s)) err(`${label} "${x.id}": unknown source "${s}"`);
  }
}

unique(sources, "sources");
for (const s of sources) {
  if (!/^https?:\/\//.test(s.url)) err(`source "${s.id}": invalid url`);
  if (!VERIFICATION.includes(s.reliability)) err(`source "${s.id}": bad reliability`);
  if (!isoDate.test(s.accessDate)) err(`source "${s.id}": accessDate must be YYYY-MM-DD`);
}

unique(vehicles, "vehicles");
refs(vehicles, "vehicle");
for (const v of vehicles) {
  if (!v.name) err(`vehicle "${v.id}": missing name`);
  if (v.dealershipId && !dealerIds.has(v.dealershipId)) err(`vehicle "${v.id}": unknown dealership "${v.dealershipId}"`);
  if (v.gamepass && !passIds.has(v.gamepass)) err(`vehicle "${v.id}": unknown gamepass "${v.gamepass}"`);
  if (v.price !== null && (typeof v.price !== "number" || v.price < 0)) err(`vehicle "${v.id}": bad price`);
  if (v.horsepower !== null && typeof v.horsepower !== "number") err(`vehicle "${v.id}": bad horsepower`);
  if (!["dealership", "event", "minigame-box", "removed", "unlisted"].includes(v.availability)) err(`vehicle "${v.id}": bad availability`);
  if (!VERIFICATION.includes(v.verification)) err(`vehicle "${v.id}": bad verification`);
  if (!isoDate.test(v.lastVerified)) err(`vehicle "${v.id}": bad lastVerified`);
}

unique(dealerships, "dealerships");
refs(dealerships, "dealership");
for (const d of dealerships) {
  if (d.coordinates !== null) err(`dealership "${d.id}": coordinates must stay null unless verified in-game`);
  if (!VERIFICATION.includes(d.verificationStatus)) err(`dealership "${d.id}": bad verificationStatus`);
}

unique(updates, "updates");
refs(updates, "update");
for (const u of updates) {
  if (!["released", "announced", "upcoming", "rumored", "unverified"].includes(u.status)) err(`update "${u.id}": bad status`);
  if (u.releaseDate && !isoDate.test(u.releaseDate)) err(`update "${u.id}": bad releaseDate`);
  if (!["exact", "approximate", "unknown"].includes(u.dateConfidence)) err(`update "${u.id}": bad dateConfidence`);
}

unique(social, "social");
refs(social, "social link");
unique(guides, "guides");
refs(guides, "guide");
unique(regions, "regions");
refs(regions, "region");
unique(timeline, "timeline");
refs(timeline, "timeline entry");
unique(gamepasses, "gamepasses");

const index = load("vehicle-index.json");
if (index.rows.length !== vehicles.length) err(`vehicle-index.json is stale (${index.rows.length} rows vs ${vehicles.length} vehicles). Re-run scripts/build_data.py`);

if (errors.length) {
  console.error(`✖ Data validation failed (${errors.length} problems):`);
  for (const e of errors.slice(0, 50)) console.error("  - " + e);
  process.exit(1);
}
console.log(
  `✔ Data valid: ${vehicles.length} vehicles, ${dealerships.length} dealerships, ${updates.length} updates, ${sources.length} sources, ${guides.length} guides`,
);
