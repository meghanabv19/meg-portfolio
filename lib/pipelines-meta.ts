// Metadata that drives the Architecture section: data-source catalog,
// pipeline node graph, and the dbt test manifest shown on-site.

export interface SourceRow {
  source: string;
  pipeline: string;
  schedule: string;
  rawTable: string;
  martTable: string;
  cacheTTL: string;
  fallback: string;
}

export const dataSources: SourceRow[] = [
  {
    source: "Spotify",
    pipeline: "batch (API pull)",
    schedule: "every 30 min",
    rawTable: "raw.spotify_plays",
    martTable: "mart.spotify_now_playing",
    cacheTTL: "45 min",
    fallback: "last cached track (amber)",
  },
  {
    source: "Strava",
    pipeline: "batch (OAuth API)",
    schedule: "every 6 hours",
    rawTable: "raw.strava_activities",
    martTable: "mart.strava_recent / strava_stats",
    cacheTTL: "8 hours",
    fallback: "last activity (amber)",
  },
  {
    source: "LeetCode",
    pipeline: "batch (public GraphQL)",
    schedule: "daily @ 00:00 UTC",
    rawTable: "raw.leetcode_stats",
    martTable: "mart.leetcode_summary",
    cacheTTL: "36 hours",
    fallback: "last snapshot (amber)",
  },
  {
    source: "HackerRank",
    pipeline: "batch (public REST)",
    schedule: "daily @ 00:00 UTC",
    rawTable: "raw.hackerrank_badges",
    martTable: "mart.hackerrank_summary / badges",
    cacheTTL: "36 hours",
    fallback: "last snapshot (amber)",
  },
  {
    source: "Google Maps",
    pipeline: "one-time batch (Takeout)",
    schedule: "manual re-run",
    rawTable: "raw.location_visits",
    martTable: "mart.tourist_places",
    cacheTTL: "static",
    fallback: "n/a — filtered set only",
  },
];

// Nodes for the animated pipeline diagram. Each is clickable.
export const pipelineNodes = [
  {
    id: "api",
    label: "Source API",
    sub: "Spotify · Strava · LeetCode",
    detail:
      "OAuth 2.0 (Spotify/Strava) or public GraphQL (LeetCode). A refresh token is exchanged for a short-lived access token at runtime — secrets live only in GitHub Actions.",
  },
  {
    id: "actions",
    label: "GitHub Actions",
    sub: "cron trigger",
    detail:
      "A scheduled workflow checks out the repo, sets up Python, installs deps, and runs the extraction script. Free-tier minutes; no server to babysit.",
  },
  {
    id: "extract",
    label: "Python extract",
    sub: "extract_*.py",
    detail:
      "Pulls the API response, normalises it into rows, and upserts raw JSON into the Supabase `raw` schema. Idempotent — safe to re-run.",
  },
  {
    id: "raw",
    label: "raw schema",
    sub: "Supabase Postgres",
    detail:
      "Landing zone. Data stored as-is (types loose, duplicates allowed). Source of truth for reprocessing — never read by the site directly.",
  },
  {
    id: "dbt",
    label: "dbt transform",
    sub: "staging → mart",
    detail:
      "staging models clean field names, cast types and dedupe; mart models shape the exact rows the UI needs. `dbt test` asserts not_null / unique / accepted_values.",
  },
  {
    id: "mart",
    label: "mart schema",
    sub: "clean tables",
    detail:
      "Query-ready, tested tables. The only schema the website's anon key can read.",
  },
  {
    id: "next",
    label: "Next.js",
    sub: "Vercel edge",
    detail:
      "Server components read mart tables with the anon key and render widgets. If a table is empty or stale, the UI falls back to cached/mock data with an amber indicator.",
  },
  {
    id: "widget",
    label: "Rendered widget",
    sub: "on this page",
    detail:
      "What you see — Now Playing, Strava totals, LeetCode stats, tourist map. Freshness is computed from the pipeline's last run timestamp.",
  },
];

// dbt test manifest surfaced in the Architecture section.
export const dbtTests = [
  { model: "mart_spotify_now_playing", test: "not_null(track_name)", status: "pass" },
  { model: "mart_spotify_now_playing", test: "not_null(synced_at)", status: "pass" },
  { model: "mart_spotify_top_tracks", test: "unique(term || rank)", status: "pass" },
  { model: "mart_spotify_top_tracks", test: "accepted_values(term)", status: "pass" },
  { model: "mart_spotify_top_artists", test: "not_null(artist_name)", status: "pass" },
  { model: "mart_strava_recent", test: "unique(activity_id)", status: "pass" },
  { model: "mart_strava_recent", test: "accepted_values(type)", status: "pass" },
  { model: "mart_strava_stats", test: "accepted_values(period)", status: "pass" },
  { model: "mart_leetcode_summary", test: "not_null(total_solved)", status: "pass" },
  { model: "mart_leetcode_summary", test: "unique(username || synced_at)", status: "pass" },
  { model: "mart_hackerrank_summary", test: "not_null(username)", status: "pass" },
  { model: "mart_hackerrank_badges", test: "unique(username || badge_name)", status: "pass" },
  { model: "mart_hackerrank_badges", test: "not_null(stars)", status: "pass" },
  { model: "mart_tourist_places", test: "not_null(lat,lng)", status: "pass" },
  { model: "mart_tourist_places", test: "accepted_values(category)", status: "pass" },
] as const;

export const techStack = [
  { tool: "Next.js 14", why: "App Router server components read the DB at request time — no client-side keys, fast first paint." },
  { tool: "Tailwind CSS", why: "The terminal/log aesthetic is mostly spacing + mono type; utility classes keep it consistent without a CSS sprawl." },
  { tool: "Vercel", why: "Zero-config Next.js hosting on the free tier, preview deploys per push." },
  { tool: "Supabase", why: "Managed Postgres with a REST layer and row-level security — schema separation (raw vs mart) maps cleanly to a warehouse." },
  { tool: "GitHub Actions", why: "Cron + secrets + compute in one place, already next to the code. No separate orchestrator to run." },
  { tool: "dbt Core", why: "Versioned SQL transforms with built-in tests — the same tooling I use for enterprise migrations, scaled down." },
  { tool: "Python", why: "Thin extraction scripts: call API, normalise, upsert. Pandas only where it earns its place." },
  { tool: "Google Maps JS API", why: "Dark-styled map + MarkerClusterer for the tourist-places layer; renders only the filtered mart table." },
];
