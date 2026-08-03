import { getSupabase } from "./supabase";
import * as mock from "./mock";
import type {
  NowPlaying,
  TopTrack,
  TopArtist,
  StravaActivity,
  StravaStats,
  LeetCodeSummary,
  HackerRankBadge,
  HackerRankSummary,
  TouristPlace,
  Freshness,
  FeedItem,
} from "./types";

// Freshness thresholds (ms) — beyond these the pipeline is considered
// stale and the UI shows an amber (cached) indicator.
const FRESH_WINDOW: Record<string, number> = {
  spotify: 45 * 60 * 1000, // pipeline runs every 30 min
  strava: 8 * 60 * 60 * 1000, // every 6h
  leetcode: 36 * 60 * 60 * 1000, // daily
};

export function freshnessOf(source: keyof typeof FRESH_WINDOW, syncedAt: string | null): Freshness {
  if (!syncedAt) return "stale";
  const age = Date.now() - new Date(syncedAt).getTime();
  if (age <= FRESH_WINDOW[source]) return "fresh";
  if (age <= FRESH_WINDOW[source] * 3) return "cached";
  return "stale";
}

// Each getter tries Supabase mart, falls back to mock on any error/empty.
// `usedFallback` is surfaced so the UI can label mock data honestly.

async function query<T>(
  table: string,
  build: (q: any) => any,
  fallback: T,
): Promise<{ data: T; usedFallback: boolean }> {
  const sb = getSupabase();
  if (!sb) return { data: fallback, usedFallback: true };
  try {
    const { data, error } = await build(sb.from(table).select("*"));
    if (error || !data || (Array.isArray(data) && data.length === 0)) {
      return { data: fallback, usedFallback: true };
    }
    return { data: data as T, usedFallback: false };
  } catch {
    return { data: fallback, usedFallback: true };
  }
}

export function getNowPlaying() {
  return query<NowPlaying>(
    "spotify_now_playing",
    (q) => q.order("synced_at", { ascending: false }).limit(1).single(),
    mock.mockNowPlaying,
  );
}

export function getTopTracks() {
  return query<TopTrack[]>(
    "spotify_top_tracks",
    (q) => q.eq("term", "short_term").order("rank", { ascending: true }).limit(5),
    mock.mockTopTracks,
  );
}

export function getTopArtists() {
  return query<TopArtist[]>(
    "spotify_top_artists",
    (q) => q.eq("term", "short_term").order("rank", { ascending: true }).limit(5),
    mock.mockTopArtists,
  );
}

export function getStravaRecent() {
  return query<StravaActivity[]>(
    "strava_recent",
    (q) => q.order("start_date", { ascending: false }).limit(10),
    mock.mockStravaRecent,
  );
}

export function getStravaStats() {
  return query<StravaStats[]>(
    "strava_stats",
    (q) => q.in("period", ["week", "month"]),
    mock.mockStravaStats,
  );
}

export function getLeetCode() {
  return query<LeetCodeSummary>(
    "leetcode_summary",
    (q) => q.order("synced_at", { ascending: false }).limit(1).single(),
    mock.mockLeetCode,
  );
}

export function getHackerRankSummary() {
  return query<HackerRankSummary>(
    "hackerrank_summary",
    (q) => q.order("synced_at", { ascending: false }).limit(1).single(),
    mock.mockHackerRankSummary,
  );
}

export function getHackerRankBadges() {
  return query<HackerRankBadge[]>(
    "hackerrank_badges",
    (q) => q.order("stars", { ascending: false }).order("points", { ascending: false }),
    mock.mockHackerRankBadges,
  );
}

export function getTouristPlaces() {
  return query<TouristPlace[]>(
    "tourist_places",
    (q) => q.order("first_visited", { ascending: true }),
    mock.mockTouristPlaces,
  );
}

// Home live-feed: fold the three pipelines into a single most-recent-first log.
export async function getFeed(): Promise<FeedItem[]> {
  const [np, strava, lc] = await Promise.all([
    getNowPlaying(),
    getStravaRecent(),
    getLeetCode(),
  ]);

  const items: FeedItem[] = [];

  const track = np.data;
  items.push({
    kind: "music",
    icon: "🎵",
    source: "Spotify",
    title: track.is_playing ? `Now playing · ${track.track_name}` : `Last played · ${track.track_name}`,
    detail: `${track.artist_name} — ${track.album_name}`,
    timestamp: track.played_at ?? track.synced_at,
    freshness: freshnessOf("spotify", track.synced_at),
  });

  const last = strava.data[0];
  if (last) {
    items.push({
      kind: "fitness",
      icon: "🏃",
      source: "Strava",
      title: `${last.type} · ${last.distance_km.toFixed(1)} km`,
      detail: last.pace_per_km ? `${last.name} — ${last.pace_per_km}/km` : last.name,
      timestamp: last.start_date,
      freshness: freshnessOf("strava", last.start_date),
    });
  }

  const code = lc.data;
  items.push({
    kind: "coding",
    icon: "💻",
    source: "LeetCode",
    title: code.last_submission_title ? `Solved · ${code.last_submission_title}` : `${code.total_solved} problems solved`,
    detail: `${code.total_solved} total · streak ${code.streak}d`,
    timestamp: code.last_submission_at ?? code.synced_at,
    freshness: freshnessOf("leetcode", code.synced_at),
  });

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
