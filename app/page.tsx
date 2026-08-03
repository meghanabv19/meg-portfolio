import AppShell from "@/components/AppShell";
import {
  getFeed,
  getNowPlaying,
  getTopTracks,
  getTopArtists,
  getStravaRecent,
  getStravaStats,
  getLeetCode,
  getHackerRankSummary,
  getHackerRankBadges,
  getTouristPlaces,
} from "@/lib/data";

// Server component: reads every mart table with the anon key on the server,
// then hands plain data to the client shell. No DB keys reach the browser.
export const revalidate = 300; // re-fetch at most every 5 min (matches pipeline cadence)

export default async function Page() {
  const [
    feed,
    nowPlaying,
    topTracks,
    topArtists,
    stravaRecent,
    stravaStats,
    leetcode,
    hackerrank,
    hackerrankBadges,
    places,
  ] = await Promise.all([
    getFeed(),
    getNowPlaying(),
    getTopTracks(),
    getTopArtists(),
    getStravaRecent(),
    getStravaStats(),
    getLeetCode(),
    getHackerRankSummary(),
    getHackerRankBadges(),
    getTouristPlaces(),
  ]);

  const data = {
    feed,
    nowPlaying,
    topTracks,
    topArtists,
    stravaRecent,
    stravaStats,
    leetcode,
    hackerrank,
    hackerrankBadges,
    places,
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    repoUrl: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "https://github.com/meghanabv19/meg-portfolio",
  };

  return <AppShell data={data} />;
}
