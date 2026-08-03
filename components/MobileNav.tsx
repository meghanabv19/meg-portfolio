"use client";

import { SECTIONS, type SectionId } from "./AppShell";

export default function MobileNav({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-5 mb-6 flex gap-1 overflow-x-auto border-b border-border bg-bg/90 px-5 py-2 backdrop-blur md:hidden">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`whitespace-nowrap rounded px-2.5 py-1 text-xs transition-colors ${
            s.id === active ? "bg-accent/10 text-accent" : "text-muted"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
