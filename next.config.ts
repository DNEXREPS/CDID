import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vehicle thumbnails are pre-optimised 250px WebP files, so the runtime optimiser is not needed
  // (and avoids image-optimisation quotas on Vercel for ~2,800 images).
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
