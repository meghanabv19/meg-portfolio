import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meghana BV — Data Engineer",
  description:
    "Senior Data Engineer. Personal portfolio + live data platform — LeetCode, HackerRank, GitHub and travel data piped end-to-end through GitHub Actions → Supabase → dbt → Next.js.",
  metadataBase: new URL("https://meghanabv19.github.io"),
  openGraph: {
    title: "Meghana BV — Data Engineer",
    description: "A portfolio that is also a live data platform.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>{children}</body>
    </html>
  );
}
