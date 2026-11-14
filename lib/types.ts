// Content entities. These mirror the JSON files in /data and map 1:1 to the SQL schema in docs/DATABASE.md.

export type Verification = "official" | "community" | "partial" | "unverified";

export type Availability = "dealership" | "event" | "minigame-box" | "removed" | "unlisted";
export type LimitedStatus = "limited" | "exclusive" | null;
export type GamepassId = "luxury" | "rare-imports" | "retro" | "emergency";

export interface Vehicle {
  id: string;
  sourceRecordId: string;
  name: string;
  manufacturer: string | null;
  realLifeBrand: string | null;
  model: string | null;
  year: number | null;
  category: string | null;
  bodyStyle: string | null;
  powertrain: "Combustion" | "Hybrid" | "Electric" | null;
  price: number | null;
  horsepower: number | null;
  engine: string | null;
  drivetrain: string | null;
  transmission: string | null;
  realLifeCounterpart: string | null;
  dealershipId: string | null;
  gamepass: GamepassId | null;
  limited: LimitedStatus;
  availability: Availability;
  limitedWindow: string | null;
  introducedVersion: string | null;
  isNew: boolean;
  flaggedInaccurate: boolean;
  image: string | null;
  wikiPage: string | null;
  lastVerified: string;
  verification: Verification;
  sourceIds: string[];
}

/** Slim catalogue row (see data/vehicle-index.json). */
export interface VehicleIndexRow {
  id: string;
  name: string;
  manufacturer: string | null;
  year: number | null;
  category: string | null;
  powertrain: Vehicle["powertrain"];
  price: number | null;
  dealershipId: string | null;
  gamepass: GamepassId | null;
  limited: LimitedStatus;
  availability: Availability;
  isNew: boolean;
  image: string | null;
  introducedVersion: string | null;
}

export interface Dealership {
  id: string;
  name: string;
  brand: string;
  category: string;
  mapName: string | null;
  city: string | null;
  locationDescription: string;
  nearbyLandmarks: string[];
  coordinates: { x: number; y: number; map: string } | null;
  description: string;
  verificationStatus: Verification;
  lastVerified: string;
  sourceIds: string[];
}

export type UpdateStatus = "released" | "announced" | "upcoming" | "rumored" | "unverified";

export interface Changelog {
  vehicles?: string[];
  maps?: string[];
  dealerships?: string[];
  features?: string[];
  jobs?: string[];
  events?: string[];
  gameplay?: string[];
  fixes?: string[];
}

export interface GameUpdate {
  id: string;
  version: string;
  releaseDate: string | null;
  dateLabel: string;
  dateConfidence: "exact" | "approximate" | "unknown";
  title: string;
  summary: string;
  officialText: string[];
  changelog: Changelog;
  status: UpdateStatus;
  image: string | null;
  sourceIds: string[];
}

export interface LimitedLogVehicle {
  name: string;
  availability: string | null;
  kind: "timed" | "event" | "event-points" | "minigame-box" | "exclusive";
  weeklyDrop: boolean;
  removed: boolean;
}

export interface LimitedLogEntry {
  version: string;
  vehicles: LimitedLogVehicle[];
}

export interface Source {
  id: string;
  title: string;
  url: string;
  sourceType: "official" | "official-archived" | "community";
  publisher: string;
  publicationDate: string | null;
  accessDate: string;
  reliability: Verification;
  notes: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  accountName: string;
  handle: string;
  url: string;
  description: string;
  officialStatus: "official" | "community";
  verificationStatus: Verification;
  sourceIds: string[];
}

export interface Gamepass {
  id: string;
  passId: number;
  name: string;
  price: number | null;
  onSale: boolean;
  description: string;
  icon: string;
  unlocksVehicles: boolean;
}

export interface Region {
  id: string;
  name: string;
  order: number;
  introducedVersion: string | null;
  summary: string;
  areas: { name: string; landmarks: string[] }[];
  facilities: string[];
  image: string | null;
  imageCaption: string | null;
  verificationStatus: Verification;
  sourceIds: string[];
  dealershipNote?: string | null;
  communityTours?: string[];
}

export interface TimelineEntry {
  id: string;
  date: string | null;
  dateLabel: string;
  dateConfidence: "exact" | "approximate" | "unknown";
  version: string | null;
  title: string;
  description: string;
  image: string | null;
  sourceIds: string[];
}

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "link"; text: string; href: string }
  | { type: "gamepasses" };

export interface Guide {
  id: string;
  title: string;
  category: string;
  summary: string;
  verification: Verification;
  sourceIds: string[];
  blocks: GuideBlock[];
}

export interface Brand {
  name: string;
  realLifeCounterpart: string | null;
  vehicleCount: number;
  inWikiBrandList: boolean;
}

export interface GameInfo {
  name: string;
  shortName: string;
  listingTitle: string;
  tagline: string;
  officialDescription: string;
  placeId: number;
  universeId: number;
  robloxUrl: string;
  groupUrl: string;
  discordUrl: string;
  developer: string;
  groupOwner: string;
  created: string;
  lastUpdated: string;
  currentVersion: string;
  genre: string;
  maxServerNote: string;
  stats: {
    asOf: string;
    visits: number;
    favorites: number;
    upVotes: number;
    downVotes: number;
    groupMembers: number;
    discordMembers: number;
    playingAtSnapshot: number;
  };
  sourceIds: string[];
}

export type HistoryVerification = "official" | "multiple" | "community" | "partial" | "unconfirmed" | "disputed";

export type ArchiveMedia =
  | { type: "image"; src: string; caption: string; credit: string }
  | { type: "youtube"; videoId: string; title: string; credit: string }
  | { type: "unavailable"; caption: string };

export interface ArchiveEntry {
  id: string;
  era: string;
  date: string | null;
  dateLabel: string;
  dateConfidence: "exact" | "approximate" | "unknown";
  version: string | null;
  title: string;
  description: string;
  media: ArchiveMedia[];
  verification: HistoryVerification;
  sourceIds: string[];
}

export interface ArchiveData {
  eras: { id: string; number: string; title: string; period: string; summary: string }[];
  entries: ArchiveEntry[];
  comparisons: {
    id: string;
    title: string;
    before: { src: string; label: string; caption: string; credit: string };
    after: { src: string; label: string; caption: string; credit: string };
    sourceIds: string[];
  }[];
  gaps: string[];
  places: { placeId: number; name: string; owner: string; created: string | null; status: string }[];
  incident: IncidentChapter;
}

export type EvidenceLabel = "Verified" | "Community Report" | "Unverified" | "Disputed" | "Unknown";

export interface IncidentChapter {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  intro: string;
  sections: { id: string; n: string; heading: string; label: EvidenceLabel; body: string[]; media?: ArchiveMedia[]; sourceIds: string[] }[];
  claims: { claim: string; label: EvidenceLabel; evidence: string; sourceIds: string[] }[];
  records: { id: string; label: string; detail: string; status: EvidenceLabel }[];
  tiktok: { url: string; creator: string; sourceId: string };
}
