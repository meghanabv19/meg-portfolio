"""Spotify extract — runs every 30 min in GitHub Actions.

Pulls: currently/last played track, top tracks, top artists (short/medium/long term).
Lands raw JSON into raw.spotify_plays / raw.spotify_top_tracks / raw.spotify_top_artists.
Also upserts a convenience mart.spotify_now_playing row so the site works even if
dbt hasn't run yet (dbt overwrites it authoritatively on the next transform).
"""
from __future__ import annotations

import requests

from _common import env, log, refresh_oauth_token, supabase

TOKEN_URL = "https://accounts.spotify.com/api/token"
API = "https://api.spotify.com/v1"
TERMS = ["short_term", "medium_term", "long_term"]


def get_token() -> str:
    return refresh_oauth_token(
        TOKEN_URL,
        env("SPOTIFY_CLIENT_ID"),
        env("SPOTIFY_CLIENT_SECRET"),
        env("SPOTIFY_REFRESH_TOKEN"),
    )


def api_get(path: str, token: str, params: dict | None = None) -> dict | None:
    resp = requests.get(
        f"{API}{path}",
        headers={"Authorization": f"Bearer {token}"},
        params=params,
        timeout=30,
    )
    if resp.status_code == 204:  # nothing playing
        return None
    resp.raise_for_status()
    return resp.json()


def current_or_recent(token: str) -> dict | None:
    now = api_get("/me/player/currently-playing", token)
    if now and now.get("item"):
        return now
    recent = api_get("/me/player/recently-played", token, {"limit": 1})
    if recent and recent.get("items"):
        first = recent["items"][0]
        return {
            "item": first["track"],
            "is_playing": False,
            "timestamp": first.get("played_at"),
        }
    return None


def main() -> None:
    token = get_token()
    sb = supabase()

    # mart tables are owned by dbt (stg_spotify_plays -> mart.spotify_now_playing).
    play = current_or_recent(token)
    if play:
        sb.schema("raw").table("spotify_plays").insert({"payload": play}).execute()
        log(f"now playing landed in raw: {play['item']['name']}")

    for term in TERMS:
        tracks = api_get("/me/top/tracks", token, {"time_range": term, "limit": 20})
        if tracks:
            sb.schema("raw").table("spotify_top_tracks").insert(
                {"term": term, "payload": tracks}
            ).execute()
        artists = api_get("/me/top/artists", token, {"time_range": term, "limit": 20})
        if artists:
            sb.schema("raw").table("spotify_top_artists").insert(
                {"term": term, "payload": artists}
            ).execute()
        log(f"top tracks/artists landed for {term}")

    log("spotify extract complete")


if __name__ == "__main__":
    main()
