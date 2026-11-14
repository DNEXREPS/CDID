"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { cx, EmptyState } from "./ui";

export interface GuideSummary {
  id: string;
  title: string;
  category: string;
  summary: string;
  text: string;
}

export function GuideIndex({ guides }: { guides: GuideSummary[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const cats = useMemo(() => [...new Set(guides.map((g) => g.category))], [guides]);
  const list = guides.filter((g) => {
    const t = q.trim().toLowerCase();
    return (!cat || g.category === cat) && (!t || `${g.title} ${g.summary} ${g.text}`.toLowerCase().includes(t));
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Guide categories">
          {["", ...cats].map((c) => (
            <button
              key={c || "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cx(
                "h-10 rounded-[3px] border px-4 text-sm font-medium transition-colors",
                cat === c ? "border-ink bg-ink text-white" : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink",
              )}
            >
              {c || "All guides"}
            </button>
          ))}
        </div>
        <label className="relative md:w-80">
          <span className="sr-only">Search guides</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guides — jobs, gacha, toll…"
            className="h-11 w-full rounded-[3px] border border-ink/20 bg-white pr-4 pl-11 text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
        </label>
      </div>
      <p className="mt-5 text-sm text-ink/60" aria-live="polite">{list.length} {list.length === 1 ? "guide" : "guides"}</p>
      {list.length === 0 ? (
        <div className="mt-6"><EmptyState title="No guides found">Try a different word, or choose &ldquo;All guides&rdquo;.</EmptyState></div>
      ) : (
        <ul className="mt-6 grid border-t border-l border-ink/15 md:grid-cols-2 lg:grid-cols-3">
          {list.map((g, i) => (
            <li key={g.id} className="border-r border-b border-ink/15">
              <Link href={`/guides/${g.id}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-white md:p-8">
                <div className="flex justify-between">
                  <span className="eyebrow text-ink/45">{g.category}</span>
                  <span className="eyebrow text-ink/35 tabular">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="display mt-6 text-2xl">{g.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{g.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
                  Read guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
