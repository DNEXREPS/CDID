// Pure filtering / sorting logic for the vehicle catalogue (shared by client UI and tests).
import type { VehicleIndexRow } from "./types";

export interface CatalogueQuery {
  q: string;
  make: string;
  cat: string;
  dealer: string;
  pass: string; // "" | "none" | gamepass id
  limited: string; // "" | "limited" | "exclusive" | "none"
  avail: string; // "" (not removed) | "all" | availability value
  pt: string; // powertrain
  pmin: string;
  pmax: string;
  sort: string;
}

export const DEFAULT_QUERY: CatalogueQuery = {
  q: "", make: "", cat: "", dealer: "", pass: "", limited: "", avail: "", pt: "", pmin: "", pmax: "", sort: "name",
};

export const SORTS = [
  { value: "name", label: "Alphabetical (A–Z)" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "recent", label: "Recently added" },
  { value: "year-desc", label: "Model year: newest" },
  { value: "hp", label: "Highest horsepower (unavailable)", disabled: true },
] as const;

export const PRICE_STEPS = [
  { value: "100000000", label: "Rp 100 jt" },
  { value: "250000000", label: "Rp 250 jt" },
  { value: "500000000", label: "Rp 500 jt" },
  { value: "1000000000", label: "Rp 1 M" },
  { value: "2500000000", label: "Rp 2,5 M" },
  { value: "5000000000", label: "Rp 5 M" },
  { value: "10000000000", label: "Rp 10 M" },
  { value: "50000000000", label: "Rp 50 M" },
];

export function versionKey(v: string | null): number {
  if (!v) return -1;
  const parts = v.replace(/^V/i, "").split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 4) parts.push(0);
  return parts.reduce((acc, n) => acc * 100 + n, 0);
}

function fold(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9+]+/g, " ").trim();
}

export function filterVehicles(rows: VehicleIndexRow[], q: CatalogueQuery): VehicleIndexRow[] {
  const terms = fold(q.q).split(" ").filter(Boolean);
  const pmin = q.pmin ? Number(q.pmin) : null;
  const pmax = q.pmax ? Number(q.pmax) : null;
  const out = rows.filter((v) => {
    if (terms.length) {
      const hay = fold(`${v.name} ${v.manufacturer ?? ""} ${v.category ?? ""}`);
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    if (q.make && v.manufacturer !== q.make) return false;
    if (q.cat && (q.cat === "__none" ? v.category !== null : v.category !== q.cat)) return false;
    if (q.dealer && v.dealershipId !== q.dealer) return false;
    if (q.pass === "none" && v.gamepass) return false;
    if (q.pass && q.pass !== "none" && v.gamepass !== q.pass) return false;
    if (q.limited === "none" && v.limited) return false;
    if (q.limited && q.limited !== "none" && v.limited !== q.limited) return false;
    if (q.avail === "" && v.availability === "removed") return false;
    if (q.avail && q.avail !== "all" && v.availability !== q.avail) return false;
    if (q.pt && v.powertrain !== q.pt) return false;
    if (pmin !== null && (v.price === null || v.price < pmin)) return false;
    if (pmax !== null && (v.price === null || v.price > pmax)) return false;
    return true;
  });
  const byName = (a: VehicleIndexRow, b: VehicleIndexRow) => a.name.localeCompare(b.name);
  const nullLast = (x: number | null, dir: 1 | -1) => (x === null ? Infinity : dir * x);
  switch (q.sort) {
    case "price-asc":
      return out.sort((a, b) => nullLast(a.price, 1) - nullLast(b.price, 1) || byName(a, b));
    case "price-desc":
      return out.sort((a, b) => nullLast(a.price, -1) - nullLast(b.price, -1) || byName(a, b));
    case "recent":
      return out.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || versionKey(b.introducedVersion) - versionKey(a.introducedVersion) || (b.year ?? 0) - (a.year ?? 0) || byName(a, b),
      );
    case "year-desc":
      return out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || byName(a, b));
    default:
      return out.sort(byName);
  }
}

export function queryFromParams(p: URLSearchParams): CatalogueQuery {
  const q = { ...DEFAULT_QUERY };
  for (const k of Object.keys(DEFAULT_QUERY) as (keyof CatalogueQuery)[]) {
    const v = p.get(k);
    if (v !== null) q[k] = v;
  }
  if (!SORTS.some((s) => s.value === q.sort && !("disabled" in s))) q.sort = "name";
  return q;
}

export function paramsFromQuery(q: CatalogueQuery): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v && v !== DEFAULT_QUERY[k as keyof CatalogueQuery]) p.set(k, v);
  return p.toString();
}
