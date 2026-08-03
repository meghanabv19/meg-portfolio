// Shared shapes mirroring the dbt mart tables the site reads from.

export type Freshness = "fresh" | "cached" | "stale";

export interface NowPlaying {
  is_playing: boolean;
  track_name: string;
  artist_name: string;
  album_name: string;
  album_art_url: string | null;
  track_url: string | null;
  played_at: string | null; // ISO
  synced_at: string; // ISO — last pipeline run
}

export interface TopTrack {
  rank: number;
  track_name: string;
  artist_name: string;
  album_art_url: string | null;
  track_url: string | null;
}

export interface TopArtist {
  rank: number;
  artist_name: string;
  image_url: string | null;
  genres: string[];
  artist_url: string | null;
}

export interface StravaActivity {
  activity_id: string;
  name: string;
  type: string; // Run, Ride, ...
  distance_km: number;
  moving_time_s: number;
  pace_per_km: string | null; // "5:32"
  elevation_m: number;
  start_date: string; // ISO
}

export interface StravaStats {
  period: "week" | "month";
  activities: number;
  distance_km: number;
  moving_time_s: number;
  elevation_m: number;
  synced_at: string;
}

export interface LeetCodeSummary {
  username: string;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_solved: number;
  ranking: number;
  streak: number;
  last_submission_title: string | null;
  last_submission_at: string | null;
  synced_at: string;
}

export interface HackerRankBadge {
  badge_name: string;
  badge_type: string | null;
  stars: number;
  max_stars: number;
  solved: number;
  points: number;
}

export interface HackerRankSummary {
  username: string;
  name: string | null;
  level: number;
  country: string | null;
  total_badges: number;
  total_stars: number;
  top_badge: string | null;
  synced_at: string;
}

export interface TouristPlace {
  place_name: string;
  city: string;
  country: string | null;
  lat: number;
  lng: number;
  category: string;
  first_visited: string; // ISO date
}

export interface FeedItem {
  kind: "music" | "fitness" | "coding";
  icon: string;
  source: string;
  title: string;
  detail: string;
  timestamp: string; // ISO
  freshness: Freshness;
}
