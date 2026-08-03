"use client";

import { useState } from "react";

// A visual of Meghana's enterprise data-migration methodology (from 7 yrs at
// BP / IKEA / Corning / Bank of America). Click a stage for detail.
const STAGES = [
  {
    id: "source",
    label: "Sources",
    icon: "🗄️",
    detail:
      "Legacy ERP, SAP ECC, DB2, SQL Server and Teradata source systems. Millions of records across dozens of interdependent tables (e.g. Business Partner: 60k headers × 15+ sub-tables).",
    tags: ["SAP ECC", "DB2", "SQL Server", "Teradata"],
  },
  {
    id: "profile",
    label: "Profile & Extract",
    icon: "🔎",
    detail:
      "Python data profiling and anomaly detection to understand source quality before touching it — spotting inconsistencies, special characters and gaps early.",
    tags: ["Python", "Pandas", "profiling"],
  },
  {
    id: "transform",
    label: "Transform",
    icon: "🧬",
    detail:
      "Complex SQL — CTEs, stored procedures and window functions — to derive, map and reshape source data into the target model. SQL functions to cleanse hidden/special characters.",
    tags: ["SQL", "CTEs", "stored procs", "window fns"],
  },
  {
    id: "dq",
    label: "Data Quality",
    icon: "✅",
    detail:
      "Pre-load and post-load validation frameworks: field-level comparison across sub-tables, duplicate detection, and tolerance-threshold checks that classify each record load-ready or flagged.",
    tags: ["pre/post-load validation", "field-level compare", "thresholds"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: "📊",
    detail:
      "Self-service reports and dashboards — duplicate analysis, positive lists, configuration comparison, record counts and error rates — so business teams decide independently, no engineer in the loop.",
    tags: ["Tableau", "self-service", "record/error counts"],
  },
  {
    id: "approval",
    label: "Business sign-off",
    icon: "🤝",
    detail:
      "Reports drive stakeholder review and formal sign-off. Record-level evidence and reconciliation give the business confidence for a controlled, zero-surprise go-live.",
    tags: ["stakeholders", "go/no-go", "audit trail"],
  },
  {
    id: "load",
    label: "Load & Reconcile",
    icon: "🚀",
    detail:
      "Load execution into SAP S/4HANA via LTMC / LSMW / IDoc, followed by post-load reconciliation confirming records loaded vs expected — the loop closes back to Data Quality.",
    tags: ["SAP S/4HANA", "LTMC", "LSMW", "reconciliation"],
  },
];

export default function MigrationFlow() {
  const [active, setActive] = useState("source");
  const stage = STAGES.find((s) => s.id === active)!;

  return (
    <div className="panel p-4 sm:p-6">
      <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setActive(s.id)}
              className={`flex min-w-[104px] flex-col items-start rounded border px-3 py-2 text-left transition-colors ${
                active === s.id ? "border-accent bg-accent/10" : "border-border bg-bg hover:border-muted"
              }`}
            >
              <span className="text-lg leading-none">{s.icon}</span>
              <span className={`mt-1 text-xs font-semibold ${active === s.id ? "text-accent" : "text-fg"}`}>
                {s.label}
              </span>
            </button>
            {i < STAGES.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>

      <div key={active} className="mt-4 animate-fadeUp rounded border border-border bg-bg p-3">
        <p className="text-sm text-muted">{stage.detail}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {stage.tags.map((t) => (
            <span key={t} className="rounded border border-border bg-panel px-1.5 py-0.5 text-[10px] text-cyan/80">
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted/70">
        The same shape as this website&apos;s own pipeline — extract, land, transform, test, publish —
        just at enterprise scale, and with millions of records instead of my playlists.
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" className="shrink-0 text-accent/60" aria-hidden>
      <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" />
      <path d="M18 2 L24 6 L18 10 Z" fill="currentColor" />
    </svg>
  );
}
