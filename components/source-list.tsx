import { ExternalLink, FileSearch } from "lucide-react";
import { getSourcesByIds } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { cx, VerificationBadge } from "./ui";

/** Collapsible list of the sources behind a record. Works without JavaScript (<details>). */
export function SourceList({
  ids, lastVerified, dark = false, className, defaultOpen = false,
}: { ids: string[]; lastVerified?: string; dark?: boolean; className?: string; defaultOpen?: boolean }) {
  const sources = getSourcesByIds(ids);
  if (!sources.length) return null;
  return (
    <details open={defaultOpen} className={cx("group border-t", dark ? "border-white/10" : "border-ink/10", className)}>
      <summary
        className={cx(
          "flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm [&::-webkit-details-marker]:hidden",
          dark ? "text-silver hover:text-paper" : "text-ink/70 hover:text-ink",
        )}
      >
        <span className="inline-flex items-center gap-2 font-medium">
          <FileSearch className="size-4" aria-hidden />
          Sources ({sources.length})
          {lastVerified && <span className="font-normal opacity-70">· last verified {formatDate(lastVerified)}</span>}
        </span>
        <span className="eyebrow opacity-70 group-open:hidden">Inspect</span>
        <span className="eyebrow hidden opacity-70 group-open:inline">Hide</span>
      </summary>
      <ol className="space-y-3 pb-5">
        {sources.map((s) => (
          <li key={s.id} className={cx("grid gap-1 border-l-2 pl-4 text-sm", dark ? "border-white/15" : "border-ink/15")}>
            <div className="flex flex-wrap items-center gap-2">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={cx("link-underline inline-flex items-center gap-1 font-medium", dark ? "text-paper" : "text-ink")}>
                {s.title}
                <ExternalLink className="size-3.5 opacity-60" aria-hidden />
              </a>
              <VerificationBadge status={s.reliability} dark={dark} />
            </div>
            <p className={cx("text-[0.8rem]", dark ? "text-steel" : "text-ink/55")}>
              {s.publisher} · {s.publicationDate ? `published/updated ${formatDate(s.publicationDate)}` : "publication date unknown"} · accessed {formatDate(s.accessDate)}
            </p>
            <p className={cx("text-[0.8rem] leading-relaxed", dark ? "text-silver/80" : "text-ink/65")}>{s.notes}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}
