import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getSources, getVehicles } from "@/lib/data";
import { formatDate, formatNumber } from "@/lib/format";
import { Container, PageHero, SectionHeading, VerificationBadge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sources & Research",
  description: "How this CDID website verifies information: every source used, its reliability, publication and access dates, and known limitations.",
};

const LIMITS = [
  "Discord channels need a logged-in account and were not read. The official server was verified through Discord's public invite API only.",
  "No source publishes in-game horsepower, so it is shown as “Not verified” for every vehicle.",
  "No source publishes in-game coordinates for dealerships. Locations are given as map, city and landmarks.",
  "Release dates for most versions are approximate, inferred from event names or archived snapshots of the Roblox listing.",
  "Prices and stock change with weekly drops. All records show the date they were last verified.",
  "Gacha odds and prizes (V2.8) are not yet documented in any source we could access.",
];

export default function SourcesPage() {
  const sources = getSources();
  const v = getVehicles();
  const byRel = (r: string) => v.filter((x) => x.verification === r).length;
  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Sources & research"
        intro="We would rather show less than show something invented. Every fact on this site traces back to one of the sources below, and anything we couldn't verify is labelled."
      />
      <section className="bg-paper text-ink">
        <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading dark={false} eyebrow="Labels" title="What the badges mean" />
            <ul className="mt-8 space-y-5 text-sm leading-relaxed">
              <li><VerificationBadge status="official" /> <span className="mt-1 block text-ink/70">Read directly from an official CDID or Roblox/Discord source.</span></li>
              <li><VerificationBadge status="community" /> <span className="mt-1 block text-ink/70">Documented by an established community source (wiki or database) and consistent across sources.</span></li>
              <li><VerificationBadge status="partial" /> <span className="mt-1 block text-ink/70">Some fields confirmed, others missing, approximate or from a single community source.</span></li>
              <li><VerificationBadge status="unverified" /> <span className="mt-1 block text-ink/70">Reported but not confirmed. Never presented as fact.</span></li>
            </ul>
          </div>
          <div>
            <SectionHeading dark={false} eyebrow="Coverage" title="Vehicle data" />
            <dl className="mt-8 grid grid-cols-2 border-t border-l border-ink/15">
              {[
                ["Vehicle records", formatNumber(v.length)],
                ["Community verified", formatNumber(byRel("community"))],
                ["Partially verified", formatNumber(byRel("partial"))],
                ["With horsepower", "0"],
              ].map(([k, n]) => (
                <div key={k} className="border-r border-b border-ink/15 p-5">
                  <dt className="eyebrow text-ink/50">{k}</dt>
                  <dd className="display mt-2 text-3xl tabular">{n}</dd>
                </div>
              ))}
            </dl>
            <h3 className="display mt-12 text-2xl">Known limitations</h3>
            <ul className="mt-4 space-y-3">
              {LIMITS.map((l) => (
                <li key={l} className="flex gap-3 text-sm leading-relaxed text-ink/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-rambu" aria-hidden />{l}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <section className="bg-asphalt">
        <Container className="py-16 md:py-20">
          <SectionHeading eyebrow="Register" title={`${sources.length} sources`} />
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-white/20">
                <tr>
                  {["Source", "Type", "Reliability", "Published / updated", "Accessed"].map((h) => (
                    <th key={h} scope="col" className="py-3 pr-4 font-display text-[0.7rem] tracking-[0.12em] text-steel uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id} id={s.id} className="border-b border-white/10 align-top">
                    <td className="py-4 pr-4">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">
                        {s.title} <ExternalLink className="size-3.5 opacity-60" />
                      </a>
                      <p className="mt-1 max-w-xl text-[0.8rem] leading-relaxed text-steel">{s.notes}</p>
                    </td>
                    <td className="py-4 pr-4 text-silver capitalize">{s.sourceType.replace("-", " ")}</td>
                    <td className="py-4 pr-4"><VerificationBadge status={s.reliability} dark /></td>
                    <td className="py-4 pr-4 text-silver tabular">{s.publicationDate ? formatDate(s.publicationDate) : "Unknown"}</td>
                    <td className="py-4 pr-4 text-silver tabular">{formatDate(s.accessDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
