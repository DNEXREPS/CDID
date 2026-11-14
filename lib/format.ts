import type { Availability, Verification } from "./types";

const idr = new Intl.NumberFormat("id-ID");

/** Rp 1.615.000.000 — Indonesian grouping, matching how CDID displays prices. */
export function formatRp(value: number | null | undefined): string {
  if (value == null) return "Not verified";
  return `Rp ${idr.format(value)}`;
}

/** Rp 1,6 M / Rp 180 M — compact form for cards (jt = juta, M = miliar). */
export function formatRpShort(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e12) return `Rp ${trim(value / 1e12)} T`;
  if (value >= 1e9) return `Rp ${trim(value / 1e9)} M`;
  if (value >= 1e6) return `Rp ${trim(value / 1e6)} jt`;
  return `Rp ${idr.format(value)}`;
}
function trim(n: number) {
  return n.toLocaleString("id-ID", { maximumFractionDigits: n < 10 ? 2 : 1 });
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en").format(n);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "Unknown";
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export const availabilityLabel: Record<Availability, string> = {
  dealership: "At dealership",
  event: "Event only",
  "minigame-box": "Minigame box",
  removed: "Removed",
  unlisted: "Not listed",
};

export const verificationLabel: Record<Verification, string> = {
  official: "Officially verified",
  community: "Community verified",
  partial: "Partially verified",
  unverified: "Unverified",
};

export const gamepassLabel: Record<string, string> = {
  luxury: "Luxury",
  "rare-imports": "Rare Imports",
  retro: "Retro",
  emergency: "Emergency",
};
