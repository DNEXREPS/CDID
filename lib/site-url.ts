// Canonical site URL for metadata, sitemap and robots.txt.
// NEXT_PUBLIC_SITE_URL: optional override (e.g. a custom domain).
// URL: set automatically by Netlify during builds to the site's main address.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/$/, "");
