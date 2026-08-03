"use client";

import { useState } from "react";

// Watch a real-shaped GitHub API response transform, step by step, into the
// rendered repo card. Same logic as extract_github.py + stg_github.sql +
// mart_github_repos.sql, shown inline.

const RAW = `{
  "name": "SQL-Challenges-and-learning",
  "description": "SQL practice & solutions",
  "language": "TSQL",
  "stargazers_count": 0,
  "fork": false,
  "pushed_at": "2026-07-27T09:14:03Z",
  "html_url": "https://github.com/meghanabv19/SQL-Challenges-and-learning"
}`;

const RAW_ROW = `-- raw.github_stats  (landed as-is, JSONB)
{ "profile": {...}, "repos": [ { "name": "SQL-Challenges-...", ... }, ... ],
  "total_contributions": 96 }`;

const STAGING = `-- mart_github_repos.sql  (explode + type the repos array)
select
  r->>'name'                              as name,
  r->>'description'                       as description,
  r->>'language'                          as language,
  coalesce((r->>'stargazers_count')::int, 0) as stars,
  (r->>'pushed_at')::timestamptz          as pushed_at,
  r->>'html_url'                          as url
from stg_github g,
     lateral jsonb_array_elements(g.payload->'repos') as r
where coalesce((r->>'fork')::boolean, false) = false
order by pushed_at desc`;

const MART = `-- mart.github_repos  (query-ready, tested)
name        | SQL-Challenges-and-learning
description | SQL practice & solutions
language    | TSQL
stars       | 0
pushed_at   | 2026-07-27 09:14:03+00`;

const steps = [
  { key: "extract", label: "1 · extract", desc: "Python calls the GitHub REST API and gets raw repo JSON", body: RAW, lang: "json" },
  { key: "raw", label: "2 · land", desc: "Upsert the whole payload into raw.github_stats (untouched)", body: RAW_ROW, lang: "sql" },
  { key: "staging", label: "3 · transform", desc: "dbt explodes the repos array → typed columns, drops forks", body: STAGING, lang: "sql" },
  { key: "mart", label: "4 · mart", desc: "dbt keeps non-fork repos, newest first; tests assert unique(name)", body: MART, lang: "sql" },
  { key: "render", label: "5 · render", desc: "Next.js reads the mart row and paints the repo card", body: "", lang: "card" },
];

export default function PipelineDemo() {
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="panel p-4">
      <div className="mb-4 flex flex-wrap gap-1">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={`rounded border px-2.5 py-1 text-[11px] transition-colors ${
              i === step ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted">{cur.desc}</p>

      <div key={cur.key} className="animate-fadeUp">
        {cur.lang === "card" ? (
          <div className="rounded border border-accent/40 bg-bg p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">SQL-Challenges-and-learning</span>
              <span className="text-[10px] text-muted">TSQL</span>
            </div>
            <div className="mt-1 text-xs text-muted">SQL practice &amp; solutions</div>
            <div className="mt-1 text-[10px] text-muted/60">pushed 27 Jul 2026</div>
          </div>
        ) : (
          <pre
            className={`overflow-x-auto rounded border border-border bg-bg p-3 text-[11px] leading-relaxed ${
              cur.lang === "json" ? "text-cyan/90" : "text-accent/90"
            }`}
          >
            {cur.body}
          </pre>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-xs text-muted disabled:opacity-30 hover:text-fg">
          ← prev
        </button>
        <div className="text-[10px] text-muted/60">step {step + 1} / {steps.length}</div>
        <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} className="text-xs text-accent disabled:opacity-30">
          next →
        </button>
      </div>
    </div>
  );
}
