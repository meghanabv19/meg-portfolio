import type {
  LeetCodeSummary,
  HackerRankBadge,
  HackerRankSummary,
  GithubSummary,
  GithubRepo,
  Book,
  TouristPlace,
} from "./types";

// Bundled sample data so the site renders end-to-end before pipelines populate
// the mart tables. Real data takes over automatically once Supabase is live.

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const mockLeetCode: LeetCodeSummary = {
  username: "meghanabv",
  easy_solved: 36,
  medium_solved: 17,
  hard_solved: 1,
  total_solved: 54,
  ranking: 2490223,
  streak: 3,
  last_submission_title: "Two Sum",
  last_submission_at: hoursAgo(30),
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

export const mockGithubSummary: GithubSummary = {
  username: "meghanabv19",
  name: "Meghana BV",
  public_repos: 11,
  followers: 0,
  contributions: 96,
  top_language: "TypeScript",
  synced_at: hoursAgo(6),
};

export const mockGithubRepos: GithubRepo[] = [
  { name: "SQL-Challenges-and-learning", description: "SQL practice & solutions", language: "TSQL", stars: 0, pushed_at: hoursAgo(160), url: "https://github.com/meghanabv19/SQL-Challenges-and-learning" },
  { name: "data-engineering-zoomcamp", description: "DE Zoomcamp coursework", language: "Jupyter Notebook", stars: 0, pushed_at: hoursAgo(3200), url: "https://github.com/meghanabv19/data-engineering-zoomcamp" },
  { name: "fastapi_blog1", description: "FastAPI learning project", language: "HTML", stars: 0, pushed_at: hoursAgo(96), url: "https://github.com/meghanabv19/fastapi_blog1" },
  { name: "SQL-Notes", description: "Notes on advanced SQL", language: "Markdown", stars: 0, pushed_at: hoursAgo(9000), url: "https://github.com/meghanabv19/SQL-Notes" },
  { name: "Docker", description: "Docker experiments", language: "Dockerfile", stars: 0, pushed_at: hoursAgo(9000), url: "https://github.com/meghanabv19/Docker" },
];

export const mockBooks: Book[] = [
  { id: 1, title: "Deep Work", author: "Cal Newport", status: "reading", rating: null, note: null, sort_order: 1 },
  { id: 2, title: "Why We Sleep", author: "Matthew Walker", status: "reading", rating: null, note: null, sort_order: 2 },
  { id: 3, title: "The Telomere Effect", author: "Blackburn & Epel", status: "reading", rating: null, note: null, sort_order: 3 },
  { id: 4, title: "White Nights", author: "Fyodor Dostoevsky", status: "reading", rating: null, note: null, sort_order: 4 },
  { id: 5, title: "Metamorphosis", author: "Franz Kafka", status: "reading", rating: null, note: null, sort_order: 5 },
  { id: 6, title: "Tuesdays with Morrie", author: "Mitch Albom", status: "reading", rating: null, note: null, sort_order: 6 },
  { id: 7, title: "And Then There Were None", author: "Agatha Christie", status: "reading", rating: null, note: null, sort_order: 7 },
];

export const mockTouristPlaces: TouristPlace[] = [
  { place_name: "London Bridge", city: "London", country: "UK", lat: 51.5079, lng: -0.0877, category: "LANDMARK", first_visited: "2026-07-24" },
  { place_name: "Big Ben", city: "London", country: "UK", lat: 51.5007, lng: -0.1246, category: "LANDMARK", first_visited: "2026-07-24" },
  { place_name: "St James's Park", city: "London", country: "UK", lat: 51.5027, lng: -0.1340, category: "PARK", first_visited: "2026-07-24" },
  { place_name: "Chinatown", city: "London", country: "UK", lat: 51.5116, lng: -0.1307, category: "TOURIST_ATTRACTION", first_visited: "2026-07-25" },
  { place_name: "Windsor Castle", city: "Windsor", country: "UK", lat: 51.4839, lng: -0.6044, category: "LANDMARK", first_visited: "2026-07-26" },
  { place_name: "Cannizaro Park", city: "London", country: "UK", lat: 51.4230, lng: -0.2360, category: "PARK", first_visited: "2026-08-01" },
  { place_name: "Wimbledon", city: "London", country: "UK", lat: 51.4340, lng: -0.2140, category: "TOURIST_ATTRACTION", first_visited: "2026-08-01" },
];
