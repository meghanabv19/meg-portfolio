import { getSupabase } from "./supabase";
import * as mock from "./mock";
import type {
  LeetCodeSummary,
  HackerRankBadge,
  HackerRankSummary,
  GithubSummary,
  GithubRepo,
  Book,
  TouristPlace,
  Freshness,
} from "./types";

// Freshness thresholds (ms) — beyond these the pipeline is considered stale.
const FRESH_WINDOW: Record<string, number> = {
  leetcode: 36 * 60 * 60 * 1000, // daily
  hackerrank: 36 * 60 * 60 * 1000,
  github: 36 * 60 * 60 * 1000,
};

export function freshnessOf(source: keyof typeof FRESH_WINDOW, syncedAt: string | null): Freshness {
  if (!syncedAt) return "stale";
  const age = Date.now() - new Date(syncedAt).getTime();
  if (age <= FRESH_WINDOW[source]) return "fresh";
  if (age <= FRESH_WINDOW[source] * 3) return "cached";
  return "stale";
}

// Each getter tries Supabase mart, falls back to bundled mock on error/empty.
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

export function getGithubSummary() {
  return query<GithubSummary>(
    "github_summary",
    (q) => q.order("synced_at", { ascending: false }).limit(1).single(),
    mock.mockGithubSummary,
  );
}

export function getGithubRepos() {
  return query<GithubRepo[]>(
    "github_repos",
    (q) => q.order("pushed_at", { ascending: false }).limit(6),
    mock.mockGithubRepos,
  );
}

export function getBooks() {
  return query<Book[]>(
    "books",
    (q) => q.order("status", { ascending: true }).order("sort_order", { ascending: true }),
    mock.mockBooks,
  );
}

export function getTouristPlaces() {
  return query<TouristPlace[]>(
    "tourist_places",
    (q) => q.order("first_visited", { ascending: true }),
    mock.mockTouristPlaces,
  );
}
