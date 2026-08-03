"use client";

import { useState } from "react";

// Watch a real-shaped Spotify API response transform, step by step, into the
// rendered Now Playing card. Purely illustrative — same logic as extract_spotify.py
// + stg_spotify_plays.sql, shown inline.

const RAW = `{
  "item": {
    "name": "Midnight City",
    "artists": [{ "name": "M83" }],
    "album": {
      "name": "Hurry Up, We're Dreaming",
      "images": [{ "url": "https://i.scdn.co/image/ab67..." }]
    },
    "external_urls": { "spotify": "https://open.spotify.com/track/1eyz..." }
  },
  "is_playing": false,
  "progress_ms": 0,
  "timestamp": 1753900000000
}`;

const RAW_ROW = `-- raw.spotify_plays  (landed as-is, JSONB)
{ "item": { "name": "Midnight City", ... }, "is_playing": false, ... }`;

const STAGING = `-- stg_spotify_plays.sql
select
  payload->'item'->>'name'                      as track_name,
  payload->'item'->'artists'->0->>'name'        as artist_name,
  payload->'item'->'album'->>'name'             as album_name,
  payload->'item'->'album'->'images'->0->>'url' as album_art_url,
  payload->'item'->'external_urls'->>'spotify'  as track_url,
  (payload->>'is_playing')::boolean             as is_playing,
  to_timestamp((payload->>'timestamp')::bigint / 1000) as played_at
from raw.spotify_plays`;

const MART = `-- mart.spotify_now_playing  (latest row, tested)
track_name    | Midnight City
artist_name   | M83
album_name    | Hurry Up, We're Dreaming
is_playing    | false
played_at     | 2026-07-30 21:06:40+00
synced_at     | 2026-07-31 16:42:00+00`;

const steps = [
  { key: "extract", label: "1 · extract", desc: "Python calls GET /me/player and gets raw JSON", body: RAW, lang: "json" },
  { key: "raw", label: "2 · land", desc: "Upsert the payload into raw.spotify_plays (untouched)", body: RAW_ROW, lang: "sql" },
  { key: "staging", label: "3 · stage", desc: "dbt flattens JSON → typed columns, dedupes", body: STAGING, lang: "sql" },
  { key: "mart", label: "4 · mart", desc: "dbt keeps the latest row; tests assert not_null", body: MART, lang: "sql" },
  { key: "render", label: "5 · render", desc: "Next.js reads the mart row and paints the card", body: "", lang: "card" },
];

export default function PipelineDemo() {
  const [step, setStep] = useState(0);
  const cur = steps[step];

  return (
    <div className="panel p-4">
      {/* step controls */}
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
          <div className="flex items-center gap-4 rounded border border-accent/40 bg-bg p-4">
            <div className="grid h-16 w-16 place-items-center rounded bg-panel text-2xl">🎵</div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted">last played</div>
              <div className="text-base font-bold">Midnight City</div>
              <div className="text-xs text-muted">M83 — Hurry Up, We&apos;re Dreaming</div>
            </div>
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
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-xs text-muted disabled:opacity-30 hover:text-fg"
        >
          ← prev
        </button>
        <div className="text-[10px] text-muted/60">
          step {step + 1} / {steps.length}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="text-xs text-accent disabled:opacity-30"
        >
          next →
        </button>
      </div>
    </div>
  );
}
