import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getDealerships, getGuides, getVehicles } from "@/lib/data";

const base = siteUrl;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-14");
  const pages = ["", "/about", "/vehicles", "/dealerships", "/updates", "/guides", "/community", "/sources"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, lastModified: now, priority: p === "" ? 1 : 0.8 })),
    ...getDealerships().map((d) => ({ url: `${base}/dealerships/${d.id}`, lastModified: now, priority: 0.6 })),
    ...getGuides().map((g) => ({ url: `${base}/guides/${g.id}`, lastModified: now, priority: 0.6 })),
    ...getVehicles()
      .filter((v) => v.availability !== "removed")
      .map((v) => ({ url: `${base}/vehicles/${v.id}`, lastModified: now, priority: 0.4 })),
  ];
}
