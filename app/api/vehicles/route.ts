import { getVehicleIndex } from "@/lib/data";

// Pre-rendered at build time and served from the CDN. Consumed by the catalogue's client-side filters.
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    { generatedFrom: "data/vehicle-index.json", count: getVehicleIndex().length, vehicles: getVehicleIndex() },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}
