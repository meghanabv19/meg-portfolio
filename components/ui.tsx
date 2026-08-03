"use client";

import type { Freshness } from "@/lib/types";

// ---- freshness / pipeline status dot ----
export function StatusDot({ state }: { state: Freshness }) {
  const map: Record<Freshness, { color: string; label: string }> = {
    fresh: { color: "bg-accent", label: "fresh" },
    cached: { color: "bg-amber", label: "cached" },
    stale: { color: "bg-red", label: "stale" },
  };
  const { color, label } = map[state];
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
      <span className={`h-2 w-2 rounded-full ${color} ${state === "fresh" ? "animate-pulseDot" : ""}`} />
      {label}
    </span>
  );
}

// ---- section header (terminal prompt style) ----
export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          <span className="text-accent">$</span> {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

// ---- relative time ----
export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ---- amber banner when serving cached / mock data ----
export function FallbackNote({ show, source }: { show: boolean; source: string }) {
  if (!show) return null;
  return (
    <div className="mb-6 flex items-center gap-2 rounded border border-amber/30 bg-amber/5 px-3 py-2 text-[11px] text-amber">
      <span className="h-1.5 w-1.5 rounded-full bg-amber" />
      Serving cached / sample data — {source} pipeline hasn&apos;t populated the mart table in this
      environment yet.
    </div>
  );
}

// ---- stat tile ----
export function Stat({
  value,
  label,
  accent = "fg",
}: {
  value: string | number;
  label: string;
  accent?: "fg" | "accent" | "cyan" | "amber";
}) {
  const color =
    accent === "accent" ? "text-accent" : accent === "cyan" ? "text-cyan" : accent === "amber" ? "text-amber" : "text-fg";
  return (
    <div className="panel px-4 py-3">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="label mt-1">{label}</div>
    </div>
  );
}
