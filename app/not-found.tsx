import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-asphalt">
      <Container className="flex min-h-[80vh] flex-col justify-center pt-24 pb-16">
        <p className="eyebrow text-steel">Error 404 · Jalan buntu</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,7rem)]">Wrong turn.</h1>
        <p className="mt-5 max-w-lg text-lg text-silver">This road doesn&apos;t lead anywhere. The page may have moved, or the vehicle may have been renamed.</p>
        <div className="lane mt-10 max-w-md text-silver" aria-hidden />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/vehicles" variant="ghost">Vehicle catalogue</Button>
        </div>
      </Container>
    </section>
  );
}
