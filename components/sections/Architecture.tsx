"use client";

import { useState } from "react";
import { SectionHeader } from "../ui";
import { dataSources, pipelineNodes, dbtTests, techStack } from "@/lib/pipelines-meta";
import PipelineDemo from "../PipelineDemo";

export default function Architecture({ repoUrl }: { repoUrl: string }) {
  const [activeNode, setActiveNode] = useState(pipelineNodes[0].id);
  const node = pipelineNodes.find((n) => n.id === activeNode)!;

  return (
    <section>
      <SectionHeader
        title="architecture"
        subtitle="How this site works · written like an internal design doc"
        right={
          <a href={repoUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan hover:underline">
            source ↗
          </a>
        }
      />

      {/* design doc intro */}
      <div className="panel mb-10 p-4 text-sm leading-relaxed text-muted">
        <p>
          <span className="text-accent"># design note — meg</span>
        </p>
        <p className="mt-2">
          I wanted the portfolio itself to be the proof of work. So every widget you see is fed by a
          real pipeline that mirrors how I&apos;d build one at work: an orchestrator on a schedule, an
          idempotent extract, a raw landing zone, versioned dbt transforms with tests, and a thin
          read layer. Same shape as an enterprise migration — just smaller, and about my music and
          runs instead of SAP material masters.
        </p>
      </div>

      {/* animated pipeline diagram */}
      <h3 className="label mb-4">pipeline · click a node</h3>
      <div className="panel p-4 sm:p-6">
        <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
          {pipelineNodes.map((n, i) => (
            <div key={n.id} className="flex items-center">
              <button
                onClick={() => setActiveNode(n.id)}
                className={`flex min-w-[92px] flex-col rounded border px-3 py-2 text-left transition-colors ${
                  activeNode === n.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg hover:border-muted"
                }`}
              >
                <span className={`text-xs font-semibold ${activeNode === n.id ? "text-accent" : "text-fg"}`}>
                  {n.label}
                </span>
                <span className="mt-0.5 text-[9px] text-muted">{n.sub}</span>
              </button>
              {i < pipelineNodes.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded border border-border bg-bg p-3 text-sm text-muted animate-fadeUp" key={activeNode}>
          <span className="text-accent">{node.label} → </span>
          {node.detail}
        </div>
      </div>

      {/* animated transform demo */}
      <h3 className="label mb-4 mt-12">demo · raw API response → rendered card</h3>
      <PipelineDemo />

      {/* data sources table */}
      <h3 className="label mb-4 mt-12">data sources</h3>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted">
              {["source", "pipeline", "schedule", "raw table", "mart table", "cache ttl", "fallback"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSources.map((r) => (
              <tr key={r.source} className="border-b border-border/50 last:border-0">
                <td className="px-3 py-2 font-semibold text-accent">{r.source}</td>
                <td className="px-3 py-2 text-muted">{r.pipeline}</td>
                <td className="px-3 py-2 text-muted">{r.schedule}</td>
                <td className="px-3 py-2 font-mono text-cyan">{r.rawTable}</td>
                <td className="px-3 py-2 font-mono text-cyan">{r.martTable}</td>
                <td className="px-3 py-2 text-muted">{r.cacheTTL}</td>
                <td className="px-3 py-2 text-muted">{r.fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* dbt lineage (text DAG) */}
      <h3 className="label mb-4 mt-12">dbt lineage · raw → staging → mart</h3>
      <div className="panel overflow-x-auto p-4">
        <pre className="min-w-[560px] text-xs leading-relaxed text-muted">
{`  raw.spotify_plays ──▶ stg_spotify_plays ─────▶ mart.spotify_now_playing  ✔ tested
  raw.spotify_top_tracks ─▶ stg_spotify_top_tracks ─▶ mart.spotify_top_tracks  ✔
  raw.strava_activities ─▶ stg_strava_activities ─┬▶ mart.strava_recent  ✔
                                                  └▶ mart.strava_stats   ✔
  raw.leetcode_stats ───▶ stg_leetcode_stats ───▶ mart.leetcode_summary  ✔
  raw.hackerrank_badges ─▶ stg_hackerrank_badges ─┬▶ mart.hackerrank_summary  ✔
                                                  └▶ mart.hackerrank_badges   ✔
  raw.location_visits ──▶ stg_location_visits ──▶ mart.tourist_places  ✔`}
        </pre>
      </div>

      {/* github actions status (representative) */}
      <h3 className="label mb-4 mt-12">github actions · scheduled runs</h3>
      <div className="panel divide-y divide-border/50">
        {[
          { wf: "spotify_pipeline.yml", when: "every 30 min", last: "3m ago", ok: true },
          { wf: "strava_pipeline.yml", when: "every 6 hours", last: "2h ago", ok: true },
          { wf: "leetcode_pipeline.yml", when: "daily 00:00 UTC", last: "6h ago", ok: true },
          { wf: "maps_load.yml", when: "manual", last: "14d ago", ok: true },
        ].map((run) => (
          <div key={run.wf} className="flex items-center gap-3 px-4 py-2.5 text-xs">
            <span className={`h-2 w-2 rounded-full ${run.ok ? "bg-accent" : "bg-red"}`} />
            <span className="flex-1 font-mono">{run.wf}</span>
            <span className="text-muted">{run.when}</span>
            <span className="w-20 text-right text-muted/70">{run.last}</span>
          </div>
        ))}
      </div>

      {/* dbt tests */}
      <h3 className="label mb-4 mt-12">dbt test results · data quality</h3>
      <div className="panel p-4">
        <div className="mb-3 text-xs text-accent">
          $ dbt test — <span className="text-fg">{dbtTests.length} of {dbtTests.length} passed</span>
        </div>
        <div className="grid gap-1 sm:grid-cols-2">
          {dbtTests.map((t) => (
            <div key={`${t.model}-${t.test}`} className="flex items-center gap-2 text-[11px]">
              <span className="text-accent">PASS</span>
              <span className="text-muted">{t.model}</span>
              <span className="text-muted/50">·</span>
              <span className="font-mono text-cyan/80">{t.test}</span>
            </div>
          ))}
        </div>
      </div>

      {/* tech stack cards */}
      <h3 className="label mb-4 mt-12">tech stack · why, not just what</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {techStack.map((t) => (
          <div key={t.tool} className="panel p-4">
            <div className="text-sm font-semibold text-accent">{t.tool}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted">{t.why}</div>
          </div>
        ))}
      </div>

      {/* honest limitations */}
      <h3 className="label mb-4 mt-12">honest limitations</h3>
      <div className="panel space-y-2 border-amber/30 p-4 text-xs text-muted">
        <p>
          <span className="text-amber">›</span> Strava data is sparse — I recently migrated from
          Cult.fit, so the totals are still building up.
        </p>
        <p>
          <span className="text-amber">›</span> Google Maps data is filtered to tourist places only
          (museums, parks, landmarks). Raw location history is parsed locally and{" "}
          <span className="text-fg">never stored on this server</span> — only the filtered, deduped
          set of public places reaches the database.
        </p>
        <p>
          <span className="text-amber">›</span> Free-tier everything: if a cron hasn&apos;t fired
          recently you may see cached data with an amber indicator. That&apos;s the fallback working
          as designed, not a bug.
        </p>
      </div>

      <div className="mt-10">
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded border border-border bg-panel px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          view full source on github ↗
        </a>
      </div>
    </section>
  );
}

function FlowArrow() {
  return (
    <svg width="28" height="12" viewBox="0 0 28 12" className="shrink-0 text-accent/60" aria-hidden>
      <line
        x1="0"
        y1="6"
        x2="22"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="animate-flow"
      />
      <path d="M22 2 L28 6 L22 10 Z" fill="currentColor" />
    </svg>
  );
}
