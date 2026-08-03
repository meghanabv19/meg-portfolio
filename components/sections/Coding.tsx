"use client";

import type {
  LeetCodeSummary,
  HackerRankSummary,
  HackerRankBadge,
  GithubSummary,
  GithubRepo,
} from "@/lib/types";
import { SectionHeader, StatusDot, FallbackNote, timeAgo } from "../ui";
import { freshnessOf } from "@/lib/data";

type W<T> = { data: T; usedFallback: boolean };

export default function CodingSection({
  lc,
  hr,
  hrBadges,
  gh,
  repos,
}: {
  lc: W<LeetCodeSummary>;
  hr: W<HackerRankSummary>;
  hrBadges: W<HackerRankBadge[]>;
  gh: W<GithubSummary>;
  repos: W<GithubRepo[]>;
}) {
  const s = lc.data;
  const fresh = freshnessOf("leetcode", s.synced_at);

  const diffs = [
    { label: "Easy", value: s.easy_solved, color: "text-accent", bar: "bg-accent" },
    { label: "Medium", value: s.medium_solved, color: "text-amber", bar: "bg-amber" },
    { label: "Hard", value: s.hard_solved, color: "text-red", bar: "bg-red" },
  ];
  const max = Math.max(...diffs.map((d) => d.value), 1);

  return (
    <section>
      <SectionHeader
        title="coding"
        subtitle="LeetCode · HackerRank · GitHub — all pipelines refresh daily"
        right={<StatusDot state={fresh} />}
      />

      <FallbackNote show={lc.usedFallback || hr.usedFallback || gh.usedFallback} source="Coding" />

      {/* ---------- LeetCode ---------- */}
      <h3 className="label mb-3">leetcode · <span className="text-cyan">@{s.username}</span></h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {diffs.map((d) => (
          <div key={d.label} className="panel p-4">
            <div className="label">{d.label}</div>
            <div className={`mt-1 text-3xl font-bold ${d.color}`}>{d.value}</div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded bg-bg">
              <div className={`h-full ${d.bar}`} style={{ width: `${(d.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <div className="label">total solved</div>
          <div className="mt-1 text-2xl font-bold text-cyan">{s.total_solved}</div>
        </div>
        <div className="panel p-4">
          <div className="label">global rank</div>
          <div className="mt-1 text-2xl font-bold">#{s.ranking.toLocaleString()}</div>
        </div>
        <div className="panel p-4">
          <div className="label">last solved</div>
          <div className="mt-1 truncate text-sm font-medium">{s.last_submission_title ?? "—"}</div>
          <div className="text-[10px] text-muted/70">{timeAgo(s.last_submission_at)}</div>
        </div>
      </div>

      {/* ---------- HackerRank ---------- */}
      <div className="mt-12 flex items-baseline justify-between">
        <h3 className="label">hackerrank · <span className="text-cyan">@{hr.data.username}</span></h3>
        <span className="text-[10px] text-muted/70">
          level {hr.data.level} · {hr.data.total_stars}★ across {hr.data.total_badges} badges
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {hrBadges.data.map((b) => {
          const gold = b.stars === b.max_stars && b.stars > 0;
          return (
            <div key={b.badge_name} className={`panel flex items-center gap-4 px-4 py-3 ${gold ? "border-amber/50" : ""}`}>
              <div className="w-32 shrink-0">
                <div className="text-sm font-semibold">{b.badge_name}</div>
                <div className="label">{b.solved} solved</div>
              </div>
              <div className="flex-1"><Stars stars={b.stars} max={b.max_stars} /></div>
              <div className="w-16 shrink-0 text-right">
                <div className={`text-sm font-bold ${gold ? "text-amber" : "text-fg"}`}>{b.points.toLocaleString()}</div>
                <div className="label">pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- GitHub ---------- */}
      <div className="mt-12 flex items-baseline justify-between">
        <h3 className="label">github · <span className="text-cyan">@{gh.data.username}</span></h3>
        <a href={`https://github.com/${gh.data.username}`} target="_blank" rel="noreferrer" className="text-[10px] text-cyan hover:underline">
          profile ↗
        </a>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="panel p-4">
          <div className="label">contributions / yr</div>
          <div className="mt-1 text-2xl font-bold text-accent">{gh.data.contributions}</div>
        </div>
        <div className="panel p-4">
          <div className="label">public repos</div>
          <div className="mt-1 text-2xl font-bold">{gh.data.public_repos}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {repos.data.map((r) => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="panel px-4 py-3 transition-colors hover:border-accent/40">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-fg">{r.name}</span>
              {r.language && <span className="shrink-0 text-[10px] text-muted">{r.language}</span>}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-muted">{r.description ?? "—"}</div>
            <div className="mt-1 text-[10px] text-muted/60">pushed {timeAgo(r.pushed_at)}</div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs italic text-muted">
        Building in public — actively upskilling toward modern data engineering (SQL, dbt, FastAPI, Docker).
      </p>
    </section>
  );
}

function Stars({ stars, max }: { stars: number; max: number }) {
  return (
    <span className="tracking-wide" aria-label={`${stars} of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < stars ? "text-amber" : "text-border"}>★</span>
      ))}
    </span>
  );
}
