"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Splash from "./Splash";
import Home from "./sections/Home";
import About from "./sections/About";
import SpotifySection from "./sections/Spotify";
import StravaSection from "./sections/Strava";
import CodingSection from "./sections/Coding";
import MapsSection from "./sections/Maps";
import Architecture from "./sections/Architecture";
import type {
  FeedItem,
  NowPlaying,
  TopTrack,
  TopArtist,
  StravaActivity,
  StravaStats,
  LeetCodeSummary,
  HackerRankSummary,
  HackerRankBadge,
  TouristPlace,
} from "@/lib/types";

type Wrapped<T> = { data: T; usedFallback: boolean };

export interface SiteData {
  feed: FeedItem[];
  nowPlaying: Wrapped<NowPlaying>;
  topTracks: Wrapped<TopTrack[]>;
  topArtists: Wrapped<TopArtist[]>;
  stravaRecent: Wrapped<StravaActivity[]>;
  stravaStats: Wrapped<StravaStats[]>;
  leetcode: Wrapped<LeetCodeSummary>;
  hackerrank: Wrapped<HackerRankSummary>;
  hackerrankBadges: Wrapped<HackerRankBadge[]>;
  places: Wrapped<TouristPlace[]>;
  mapsKey: string;
  repoUrl: string;
}

export const SECTIONS = [
  { id: "about", label: "About", hint: "start here" },
  { id: "home", label: "Activity", hint: "live feed" },
  { id: "spotify", label: "Spotify", hint: "now playing" },
  { id: "strava", label: "Strava", hint: "fitness" },
  { id: "coding", label: "Coding", hint: "leetcode" },
  { id: "maps", label: "Maps", hint: "travel" },
  { id: "architecture", label: "Architecture", hint: "how it works" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export default function AppShell({ data }: { data: SiteData }) {
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<SectionId>("about");

  const go = useCallback((delta: number) => {
    setActive((cur) => {
      const i = SECTIONS.findIndex((s) => s.id === cur);
      const next = (i + delta + SECTIONS.length) % SECTIONS.length;
      return SECTIONS[next].id;
    });
  }, []);

  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        go(-1);
      } else if (/^[1-7]$/.test(e.key)) {
        setActive(SECTIONS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, go]);

  if (!entered) return <Splash onEnter={() => setEntered(true)} />;

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 min-w-0 px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <MobileNav active={active} onSelect={setActive} />
          <div key={active} className="animate-fadeUp">
            {active === "home" && <Home feed={data.feed} />}
            {active === "about" && <About />}
            {active === "spotify" && (
              <SpotifySection
                nowPlaying={data.nowPlaying}
                topTracks={data.topTracks}
                topArtists={data.topArtists}
              />
            )}
            {active === "strava" && (
              <StravaSection recent={data.stravaRecent} stats={data.stravaStats} />
            )}
            {active === "coding" && (
              <CodingSection
                lc={data.leetcode}
                hr={data.hackerrank}
                hrBadges={data.hackerrankBadges}
              />
            )}
            {active === "maps" && <MapsSection places={data.places} apiKey={data.mapsKey} />}
            {active === "architecture" && <Architecture repoUrl={data.repoUrl} />}
          </div>

          <footer className="mt-16 border-t border-border pt-4 text-[10px] uppercase tracking-[0.2em] text-muted">
            BUILD 26.07 // CRAFTED BY MEG
          </footer>
        </div>
      </main>
    </div>
  );
}
