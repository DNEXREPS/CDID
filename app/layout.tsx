import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Car Driving Indonesia — CDID",
    template: "%s · CDID",
  },
  description:
    "Car Driving Indonesia (CDID) on Roblox: drive, work and roleplay across Jakarta, Jawa Barat, Jawa Tengah, Jawa Timur and Bali. Browse the sourced vehicle catalogue, dealerships, update history and guides.",
  keywords: ["Car Driving Indonesia", "CDID", "Roblox", "CDID vehicles", "CDID dealership", "CDID update", "CDID Studio"],
  openGraph: {
    type: "website",
    siteName: "Car Driving Indonesia",
    images: [{ url: "/images/media/shot-12846484501.webp", width: 768, height: 432, alt: "Traffic on a CDID highway" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0d0e10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
