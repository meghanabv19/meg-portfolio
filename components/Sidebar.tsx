"use client";

import { SECTIONS, type SectionId } from "./AppShell";

export default function Sidebar({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-panel/40 px-4 py-8 md:flex">
      <div className="px-2">
        <div className="text-sm font-bold">Meghana BV</div>
        <div className="label mt-1">data engineer</div>
      </div>

      <nav className="mt-10 flex flex-col gap-1" aria-label="Sections">
        {SECTIONS.map((s, i) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              aria-current={on ? "page" : undefined}
              className={`group flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                on ? "bg-accent/10 text-accent" : "text-muted hover:text-fg"
              }`}
            >
              <span className={`w-1.5 ${on ? "text-accent" : "text-transparent group-hover:text-muted"}`}>
                {on ? "›" : "·"}
              </span>
              <span className="flex-1">{s.label}</span>
              <span className="text-[10px] text-muted/50">{i + 1}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 px-2">
        <div className="text-[10px] text-muted/60">
          <span className="kbd">↑</span> <span className="kbd">↓</span> navigate
        </div>
        <div className="text-[10px] text-muted/60">
          <span className="kbd">1</span>–<span className="kbd">7</span> jump
        </div>
        <a
          href="https://github.com/meghanabv19"
          target="_blank"
          rel="noreferrer"
          className="block text-[10px] text-muted/60 hover:text-accent"
        >
          github.com/meghanabv19 ↗
        </a>
      </div>
    </aside>
  );
}
