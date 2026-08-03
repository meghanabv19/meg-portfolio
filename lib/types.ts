// Shared shapes mirroring the dbt mart tables the site reads from.

export type Freshness = "fresh" | "cached" | "stale";

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

export interface GithubSummary {
  username: string;
  name: string | null;
  public_repos: number;
  followers: number;
  contributions: number;
  top_language: string | null;
  synced_at: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushed_at: string;
  url: string;
}

export interface Book {
  id: number;
  title: string;
  author: string | null;
  status: "reading" | "read" | "want";
  rating: number | null;
  note: string | null;
  sort_order: number;
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
