// Server-side data access. Content lives in /data as JSON; swap these functions for
// Supabase/PostgreSQL queries later without touching any page component.
import "server-only";

import vehiclesJson from "@/data/vehicles.json";
import indexJson from "@/data/vehicle-index.json";
import dealershipsJson from "@/data/dealerships.json";
import updatesJson from "@/data/updates.json";
import limitedLogJson from "@/data/limited-log.json";
import sourcesJson from "@/data/sources.json";
import socialJson from "@/data/social.json";
import gamepassesJson from "@/data/gamepasses.json";
import regionsJson from "@/data/regions.json";
import seasonalJson from "@/data/seasonal-maps.json";
import timelineJson from "@/data/timeline.json";
import guidesJson from "@/data/guides.json";
import brandsJson from "@/data/brands.json";
import gameJson from "@/data/game.json";
import archiveJson from "@/data/archive.json";
import type {
  ArchiveData, Brand, Dealership, GameInfo, GameUpdate, Gamepass, Guide, LimitedLogEntry, Region, SocialLink, Source,
  TimelineEntry, Vehicle, VehicleIndexRow,
} from "./types";

const vehicles = vehiclesJson as Vehicle[];
const vehicleById = new Map(vehicles.map((v) => [v.id, v]));
const dealerships = dealershipsJson as Dealership[];
const dealershipById = new Map(dealerships.map((d) => [d.id, d]));
const sources = sourcesJson as Source[];
const sourceById = new Map(sources.map((s) => [s.id, s]));

export const game = gameJson as GameInfo;

export function getVehicles(): Vehicle[] {
  return vehicles;
}
export function getVehicle(id: string): Vehicle | undefined {
  return vehicleById.get(id);
}
export function getVehicleIndex(): VehicleIndexRow[] {
  const { keys, rows } = indexJson as { keys: string[]; rows: unknown[][] };
  return rows.map((r) => Object.fromEntries(keys.map((k, i) => [k, r[i]])) as unknown as VehicleIndexRow);
}
export function getVehiclesByDealership(id: string): Vehicle[] {
  return vehicles.filter((v) => v.dealershipId === id);
}

export function getDealerships(): Dealership[] {
  return dealerships;
}
export function getDealership(id: string | null | undefined): Dealership | undefined {
  return id ? dealershipById.get(id) : undefined;
}
/** Vehicle counts per dealership: currently sold (not removed/event/box) and total listed. */
export function getDealershipCounts(): Record<string, { current: number; total: number }> {
  const out: Record<string, { current: number; total: number }> = {};
  for (const v of vehicles) {
    if (!v.dealershipId) continue;
    const c = (out[v.dealershipId] ??= { current: 0, total: 0 });
    c.total++;
    if (v.availability === "dealership") c.current++;
  }
  return out;
}

export function getUpdates(): GameUpdate[] {
  return updatesJson as GameUpdate[];
}
export function getLimitedLog(): LimitedLogEntry[] {
  return limitedLogJson as LimitedLogEntry[];
}

export function getSources(): Source[] {
  return sources;
}
export function getSourcesByIds(ids: string[]): Source[] {
  return ids.map((id) => sourceById.get(id)).filter((s): s is Source => Boolean(s));
}

export function getSocialLinks(): SocialLink[] {
  return socialJson as SocialLink[];
}
export function getGamepasses(): Gamepass[] {
  return gamepassesJson as Gamepass[];
}
export function getGamepass(id: string | null): Gamepass | undefined {
  return id ? (gamepassesJson as Gamepass[]).find((g) => g.id === id) : undefined;
}
export function getRegions(): Region[] {
  return (regionsJson as Region[]).slice().sort((a, b) => a.order - b.order);
}
export function getSeasonalMaps(): { name: string; introducedVersion: string; note: string; sourceIds: string[] }[] {
  return seasonalJson;
}
export function getTimeline(): TimelineEntry[] {
  return timelineJson as TimelineEntry[];
}
export function getGuides(): Guide[] {
  return guidesJson as Guide[];
}
export function getGuide(id: string): Guide | undefined {
  return (guidesJson as Guide[]).find((g) => g.id === id);
}
export function getBrands(): Brand[] {
  return brandsJson as Brand[];
}
export function getBrand(name: string | null): Brand | undefined {
  return name ? (brandsJson as Brand[]).find((b) => b.name === name) : undefined;
}

/** Hand-picked homepage line-up, resolved by exact in-game name so it fails loudly if data changes. */
const FEATURED_NAMES = [
  "2024 Murceso-Venz AMG One",
  "1994 McSena F1 LM",
  "2026 Honade Super-ONE",
  "2017 Kronenvik Valkrja",
  "2024 Tokoma Alphard 2.5 HEV Modellista",
  "1989 Naisen Skyline GT-R",
  "2024 DIR Seal AWD",
  "2025 SLM Semeru Mulia Sport 2.8 DT Komodo",
];
export function getFeaturedVehicles(): Vehicle[] {
  const byName = new Map(vehicles.map((v) => [v.name.toLowerCase(), v]));
  const picked = FEATURED_NAMES.map((n) => byName.get(n.toLowerCase())).filter((v): v is Vehicle => Boolean(v?.image));
  if (picked.length >= 4) return picked;
  return vehicles.filter((v) => v.image && v.availability === "dealership").slice(0, 8);
}

export function getArchive(): ArchiveData {
  return archiveJson as ArchiveData;
}
