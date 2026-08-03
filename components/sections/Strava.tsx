"use client";

import type { StravaActivity, StravaStats } from "@/lib/types";
import { SectionHeader, StatusDot, FallbackNote, Stat, timeAgo } from "../ui";
import { freshnessOf } from "@/lib/data";

type W<T> = { data: T; usedFallback: boolean };

function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function StravaSection({
  recent,
  stats,
}: {
  recent: W<StravaActivity[]>;
  stats: W<StravaStats[]>;
}) {
  const last = recent.data[0];
  const week = stats.data.find((s) => s.period === "week");
  const month = stats.data.find((s) => s.period === "month");
  const fresh = freshnessOf("strava", last?.start_date ?? null);
  const usedFallback = recent.usedFallback || stats.usedFallback;

  return (
    <section>
      <SectionHeader
        title="strava"
        subtitle="Pipeline runs every 6 hours · reads mart.strava_recent + strava_stats"
        right={<StatusDot state={fresh} />}
      />

      <FallbackNote show={usedFallback} source="Strava" />

      {last && (
        <div className="panel p-4">
          <div className="flex items-center justify-between">
            <span className="label text-accent/80">last activity · {last.type}</span>
            <span className="text-[10px] text-muted/70">{timeAgo(last.start_date)}</span>
          </div>
          <div className="mt-2 text-lg font-bold">{last.name}</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={`${last.distance_km.toFixed(1)}`} label="km" accent="accent" />
            <Stat value={last.pace_per_km ? `${last.pace_per_km}` : "—"} label="min/km" />
            <Stat value={`${last.elevation_m}`} label="m elevation" />
            <Stat value={fmtDuration(last.moving_time_s)} label="moving time" />
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="panel p-4">
          <div className="label mb-3">this week</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat value={week?.activities ?? 0} label="activities" />
            <Stat value={`${(week?.distance_km ?? 0).toFixed(1)}`} label="km" accent="cyan" />
            <Stat value={`${week?.elevation_m ?? 0}`} label="m up" />
          </div>
        </div>
        <div className="panel p-4">
          <div className="label mb-3">this month</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat value={month?.activities ?? 0} label="activities" />
            <Stat value={`${(month?.distance_km ?? 0).toFixed(1)}`} label="km" accent="cyan" />
            <Stat value={`${month?.elevation_m ?? 0}`} label="m up" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs italic text-muted">
        Former Cult.fit person, now on Strava 🏃 — data is building up!
      </p>
    </section>
  );
}
