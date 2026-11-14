import type { Metadata } from "next";
import { getGuides } from "@/lib/data";
import { Container, PageHero } from "@/components/ui";
import { GuideIndex } from "@/components/guide-index";

export const metadata: Metadata = {
  title: "Guides",
  description: "Car Driving Indonesia guides: getting started, jobs and money, buying cars, dealerships, customisation, game passes, limited cars, events and more.",
};

export default function GuidesPage() {
  const guides = getGuides().map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category,
    summary: g.summary,
    text: g.blocks
      .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "rows" in b ? b.rows.flat().join(" ") : ""))
      .join(" "),
  }));
  return (
    <>
      <PageHero
        eyebrow="Game information"
        title="Guides"
        image="/images/media/shot-14006200909.webp"
        intro="Practical guides to life on CDID's roads, limited to features confirmed by official changelogs or documented by the community. Each guide lists its sources."
      />
      <section className="bg-paper text-ink">
        <Container className="py-12 md:py-16">
          <GuideIndex guides={guides} />
        </Container>
      </section>
    </>
  );
}
