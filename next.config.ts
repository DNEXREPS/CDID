import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is pre-rendered at build time (SSG), so the site is exported as plain static files
  // into /out. This deploys to Netlify's CDN with no server functions (works on the free plan).
  output: "export",
  // Vehicle thumbnails are already optimised 250px WebP files, so the runtime image optimiser is not
  // needed (and is not available in a static export).
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
