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
} from "./types";

// Bundled sample data so the site renders end-to-end before any pipeline
// has run / before secrets are wired. Everything below is representative,
// not real. Once Supabase mart tables are populated, live data takes over.

const now = () => new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000).toISOString();

export const mockNowPlaying: NowPlaying = {
  is_playing: false,
  track_name: "Midnight City",
  artist_name: "M83",
  album_name: "Hurry Up, We're Dreaming",
  album_art_url: null,
  track_url: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt",
  played_at: hoursAgo(2),
  synced_at: hoursAgo(0.2),
};

export const mockTopTracks: TopTrack[] = [
  { rank: 1, track_name: "Weightless", artist_name: "Marconi Union", album_art_url: null, track_url: null },
  { rank: 2, track_name: "Midnight City", artist_name: "M83", album_art_url: null, track_url: null },
  { rank: 3, track_name: "Nightcall", artist_name: "Kavinsky", album_art_url: null, track_url: null },
  { rank: 4, track_name: "Strobe", artist_name: "deadmau5", album_art_url: null, track_url: null },
  { rank: 5, track_name: "Teardrop", artist_name: "Massive Attack", album_art_url: null, track_url: null },
];

export const mockTopArtists: TopArtist[] = [
  { rank: 1, artist_name: "M83", image_url: null, genres: ["indietronica", "shoegaze"], artist_url: null },
  { rank: 2, artist_name: "Bonobo", image_url: null, genres: ["downtempo"], artist_url: null },
  { rank: 3, artist_name: "Tycho", image_url: null, genres: ["chillwave"], artist_url: null },
  { rank: 4, artist_name: "ODESZA", image_url: null, genres: ["electropop"], artist_url: null },
  { rank: 5, artist_name: "Massive Attack", image_url: null, genres: ["trip hop"], artist_url: null },
];

export const mockStravaRecent: StravaActivity[] = [
  {
    activity_id: "mock-1",
    name: "Morning Run — Thames Path",
    type: "Run",
    distance_km: 5.2,
    moving_time_s: 1720,
    pace_per_km: "5:31",
    elevation_m: 24,
    start_date: daysAgo(2),
  },
  {
    activity_id: "mock-2",
    name: "Easy Ride",
    type: "Ride",
    distance_km: 14.8,
    moving_time_s: 2940,
    pace_per_km: null,
    elevation_m: 88,
    start_date: daysAgo(5),
  },
];

export const mockStravaStats: StravaStats[] = [
  { period: "week", activities: 2, distance_km: 8.4, moving_time_s: 3010, elevation_m: 42, synced_at: hoursAgo(3) },
  { period: "month", activities: 6, distance_km: 41.7, moving_time_s: 14980, elevation_m: 310, synced_at: hoursAgo(3) },
];

export const mockLeetCode: LeetCodeSummary = {
  username: "meghanabv19",
  easy_solved: 142,
  medium_solved: 118,
  hard_solved: 27,
  total_solved: 287,
  ranking: 214503,
  streak: 12,
  last_submission_title: "Trapping Rain Water",
  last_submission_at: hoursAgo(18),
  synced_at: hoursAgo(6),
};

export const mockHackerRankSummary: HackerRankSummary = {
  username: "meghanabv11",
  name: "Meghana BV",
  level: 5,
  country: "United Kingdom",
  total_badges: 5,
  total_stars: 14,
  top_badge: "Sql",
  synced_at: hoursAgo(6),
};

export const mockHackerRankBadges: HackerRankBadge[] = [
  { badge_name: "Sql", badge_type: "sql", stars: 5, max_stars: 5, solved: 58, points: 1105 },
  { badge_name: "Python", badge_type: "python", stars: 4, max_stars: 5, solved: 19, points: 275 },
  { badge_name: "Problem Solving", badge_type: "problem-solving", stars: 3, max_stars: 6, solved: 19, points: 237 },
  { badge_name: "30 Days of Code", badge_type: "30-days-of-code", stars: 2, max_stars: 5, solved: 12, points: 12 },
  { badge_name: "Java", badge_type: "java", stars: 0, max_stars: 5, solved: 1, points: 3 },
];

export const mockTouristPlaces: TouristPlace[] = [
  { place_name: "Tower of London", city: "London", country: "UK", lat: 51.5081, lng: -0.0759, category: "LANDMARK", first_visited: daysAgo(120) },
  { place_name: "British Museum", city: "London", country: "UK", lat: 51.5194, lng: -0.1270, category: "MUSEUM", first_visited: daysAgo(200) },
  { place_name: "Hyde Park", city: "London", country: "UK", lat: 51.5073, lng: -0.1657, category: "PARK", first_visited: daysAgo(90) },
  { place_name: "Edinburgh Castle", city: "Edinburgh", country: "UK", lat: 55.9486, lng: -3.1999, category: "LANDMARK", first_visited: daysAgo(310) },
  { place_name: "Roman Baths", city: "Bath", country: "UK", lat: 51.3811, lng: -2.3590, category: "TOURIST_ATTRACTION", first_visited: daysAgo(260) },
  { place_name: "Sagrada Família", city: "Barcelona", country: "Spain", lat: 41.4036, lng: 2.1744, category: "LANDMARK", first_visited: daysAgo(410) },
];

export const MOCK_SYNCED_AT = now();
