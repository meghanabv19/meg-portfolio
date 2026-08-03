"use client";

import type { Book } from "@/lib/types";
import { SectionHeader, FallbackNote } from "../ui";

type W<T> = { data: T; usedFallback: boolean };

const HOBBIES = [
  { icon: "📚", name: "Reading", note: "fiction, DE, and the odd sleep-science book" },
  { icon: "🏃", name: "Running", note: "building a habit around London" },
  { icon: "🧠", name: "Learning new things", note: "always upskilling — currently AWS + dbt" },
  { icon: "🥾", name: "Hiking", note: "weekends outdoors when the weather allows" },
];

const STATUS_LABEL: Record<Book["status"], string> = {
  reading: "Currently reading",
  read: "Read",
  want: "Want to read",
};

export default function Personal({ books }: { books: W<Book[] > }) {
  const groups: Book["status"][] = ["reading", "read", "want"];
  const byStatus = (st: Book["status"]) => books.data.filter((b) => b.status === st);

  return (
    <section>
      <SectionHeader
        title="personal"
        subtitle="Life outside the pipelines"
      />

      <FallbackNote show={books.usedFallback} source="Reading list" />

      {/* hobbies */}
      <div className="grid gap-3 sm:grid-cols-2">
        {HOBBIES.map((h) => (
          <div key={h.name} className="panel flex items-start gap-3 px-4 py-3">
            <div className="text-2xl leading-none">{h.icon}</div>
            <div>
              <div className="text-sm font-semibold">{h.name}</div>
              <div className="text-xs text-muted">{h.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* reading list */}
      <div className="mt-12 flex items-baseline justify-between">
        <h3 className="label">reading list 📖</h3>
        <span className="text-[10px] text-muted/60">self-curated</span>
      </div>

      <div className="mt-3 space-y-6">
        {groups.map((st) => {
          const items = byStatus(st);
          if (items.length === 0) return null;
          return (
            <div key={st}>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-accent/80">
                {STATUS_LABEL[st]} <span className="text-muted/60">· {items.length}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((b) => (
                  <div key={b.id} className="panel px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{b.title}</div>
                        {b.author && <div className="truncate text-xs text-muted">{b.author}</div>}
                      </div>
                      {b.rating ? (
                        <span className="shrink-0 text-[11px] text-amber">{"★".repeat(b.rating)}</span>
                      ) : null}
                    </div>
                    {b.note && <div className="mt-1 text-xs italic text-muted/80">{b.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
