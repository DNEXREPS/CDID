"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="bg-asphalt">
      <Container className="flex min-h-[70vh] flex-col justify-center pt-24 pb-16">
        <p className="eyebrow text-steel">Something went wrong</p>
        <h1 className="display mt-4 text-5xl">Engine stalled.</h1>
        <p className="mt-4 max-w-lg text-silver">This page hit an unexpected error. Try again, or head back to the homepage.</p>
        <div className="mt-8 flex gap-3">
          <button type="button" onClick={reset} className="h-12 rounded-[3px] bg-merah px-5 font-display text-sm font-bold tracking-[0.1em] uppercase">
            Try again
          </button>
          <a href="/" className="inline-flex h-12 items-center rounded-[3px] border border-white/30 px-5 font-display text-sm font-bold tracking-[0.1em] uppercase">
            Home
          </a>
        </div>
      </Container>
    </section>
  );
}
