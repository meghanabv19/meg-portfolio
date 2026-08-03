import AppShell from "@/components/AppShell";
import {
  getLeetCode,
  getHackerRankSummary,
  getHackerRankBadges,
  getGithubSummary,
  getGithubRepos,
  getBooks,
  getTouristPlaces,
} from "@/lib/data";

// Server component: reads every mart table with the anon key on the server,
// then hands plain data to the client shell. No DB keys reach the browser.
export const revalidate = 300; // re-fetch at most every 5 min

export default async function Page() {
  const [leetcode, hackerrank, hackerrankBadges, github, githubRepos, books, places] =
    await Promise.all([
      getLeetCode(),
      getHackerRankSummary(),
      getHackerRankBadges(),
      getGithubSummary(),
      getGithubRepos(),
      getBooks(),
      getTouristPlaces(),
    ]);

  const data = {
    leetcode,
    hackerrank,
    hackerrankBadges,
    github,
    githubRepos,
    books,
    places,
    mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL ?? "",
    repoUrl: process.env.NEXT_PUBLIC_GITHUB_REPO ?? "https://github.com/meghanabv19/meg-portfolio",
  };

  return <AppShell data={data} />;
}
