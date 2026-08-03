"use client";

import type { FeedItem } from "@/lib/types";
import { SectionHeader, StatusDot, timeAgo } from "../ui";

export default function Home({ feed }: { feed: FeedItem[] }) {
  return (
    <section>
      <SectionHeader
        title="live feed"
        subtitle="Most recent activity across every pipeline · newest first"
      />

      <div className="mb-6 rounded border border-border bg-panel/40 px-4 py-3 text-xs text-muted">
        <span className="text-accent">~</span> This site isn&apos;t just a portfolio — it&apos;s a live
        data platform. Every card below was extracted by a scheduled job, landed in Postgres, cleaned
        by dbt, and served from a tested mart table. See{" "}
        <span className="text-cyan">Architecture</span> for how.
      </div>

      <ol className="space-y-3">
        {feed.map((item, i) => (
          <li
            key={`${item.kind}-${i}`}
            className="panel flex items-start gap-4 px-4 py-4 transition-colors hover:border-accent/40"
          >
            <div className="text-2xl leading-none">{item.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="label text-accent/80">{item.source}</span>
                <span className="text-muted/40">·</span>
                <span className="label">{item.kind}</span>
              </div>
              <div className="mt-1 truncate font-medium">{item.title}</div>
              <div className="truncate text-sm text-muted">{item.detail}</div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <StatusDot state={item.freshness} />
              <span className="text-[10px] text-muted/70">{timeAgo(item.timestamp)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
