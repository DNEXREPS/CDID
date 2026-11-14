import { getVehicleIndex } from "@/lib/data";

// Pre-rendered at build time into /out/api/vehicles.json (a static file on the CDN).
// Consumed by the catalogue's client-side search, filters and sorting.
export const dynamic = "force-static";

export function GET() {
  const vehicles = getVehicleIndex();
  return Response.json({ generatedFrom: "data/vehicle-index.json", count: vehicles.length, vehicles });
}
