"use client";

import { useEffect } from "react";

export default function Splash({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onEnter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnter]);

  return (
    <button
      onClick={onEnter}
      className="group relative flex min-h-screen w-full flex-col items-center justify-center text-center"
      aria-label="Enter site"
    >
      <div className="animate-fadeUp">
        <div className="label mb-6">meghanabv19 · ~/portfolio</div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Meghana BV
          <span className="ml-1 inline-block h-[0.9em] w-[0.55ch] translate-y-[0.06em] bg-accent align-baseline animate-blink" />
        </h1>
        <p className="mt-5 text-sm text-muted sm:text-base">
          Data Engineer · Open to roles in the UK
        </p>
        <p className="mt-1 text-xs text-muted/70">
          SQL · ETL · Data Migration
        </p>

        <div className="mt-14 text-xs uppercase tracking-[0.3em] text-muted transition-colors group-hover:text-accent">
          click anywhere to enter
        </div>
        <div className="mt-2 text-[10px] text-muted/60">
          or press <span className="kbd">Enter</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 text-[10px] uppercase tracking-[0.2em] text-muted/50">
        BUILD 26.07 // live data platform
      </div>
    </button>
  );
}
