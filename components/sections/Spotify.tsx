"use client";

import type { NowPlaying, TopTrack, TopArtist } from "@/lib/types";
import { freshnessOf } from "@/lib/data";
import { SectionHeader, StatusDot, FallbackNote, timeAgo } from "../ui";

type W<T> = { data: T; usedFallback: boolean };

export default function SpotifySection({
  nowPlaying,
  topTracks,
  topArtists,
}: {
  nowPlaying: W<NowPlaying>;
  topTracks: W<TopTrack[]>;
  topArtists: W<TopArtist[]>;
}) {
  const np = nowPlaying.data;
  const fresh = freshnessOf("spotify", np.synced_at);
  const usedFallback = nowPlaying.usedFallback || topTracks.usedFallback || topArtists.usedFallback;

  return (
    <section>
      <SectionHeader
        title="spotify"
        subtitle="Pipeline runs every 30 min · reads mart.spotify_now_playing"
        right={<StatusDot state={fresh} />}
      />

      <FallbackNote show={usedFallback} source="Spotify" />

      {/* Now playing */}
      <div className="panel flex items-center gap-4 p-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded bg-bg">
          {np.album_art_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={np.album_art_url} alt={np.album_name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl">🎵</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {np.is_playing ? (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-accent">
                <Bars /> now playing
              </span>
            ) : (
              <span className="label">last played</span>
            )}
          </div>
          <a
            href={np.track_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-lg font-bold hover:text-accent"
          >
            {np.track_name}
          </a>
          <div className="truncate text-sm text-muted">
            {np.artist_name} — {np.album_name}
          </div>
        </div>
      </div>
      <div className="mt-2 text-right text-[10px] text-muted/70">
        last pipeline run · {timeAgo(np.synced_at)}
      </div>

      {/* Top tracks + artists */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="label mb-3">top tracks · this month</h3>
          <ol className="space-y-1">
            {topTracks.data.map((t) => (
              <li key={t.rank} className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-panel">
                <span className="w-5 text-right text-sm text-muted">{t.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{t.track_name}</div>
                  <div className="truncate text-xs text-muted">{t.artist_name}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="label mb-3">top artists · this month</h3>
          <ol className="space-y-1">
            {topArtists.data.map((a) => (
              <li key={a.rank} className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-panel">
                <span className="w-5 text-right text-sm text-muted">{a.rank}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{a.artist_name}</div>
                  <div className="truncate text-xs text-muted">{a.genres.join(" · ")}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Bars() {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-0.5 bg-accent"
          style={{
            height: 8,
            animation: `pulseDot 1s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
