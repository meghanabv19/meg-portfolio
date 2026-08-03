"""Strava extract — runs every 6 hours in GitHub Actions.

Pulls recent activities and lands raw JSON into raw.strava_activities
(keyed by activity id, so re-runs are idempotent).
"""
from __future__ import annotations

import requests

from _common import env, log, refresh_oauth_token, supabase

TOKEN_URL = "https://www.strava.com/oauth/token"
API = "https://www.strava.com/api/v3"


def get_token() -> str:
    return refresh_oauth_token(
        TOKEN_URL,
        env("STRAVA_CLIENT_ID"),
        env("STRAVA_CLIENT_SECRET"),
        env("STRAVA_REFRESH_TOKEN"),
    )


def fetch_activities(token: str, per_page: int = 30) -> list[dict]:
    resp = requests.get(
        f"{API}/athlete/activities",
        headers={"Authorization": f"Bearer {token}"},
        params={"per_page": per_page, "page": 1},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def main() -> None:
    token = get_token()
    sb = supabase()

    activities = fetch_activities(token)
    rows = [{"activity_id": a["id"], "payload": a} for a in activities]
    if rows:
        # upsert on primary key activity_id — safe to re-run
        sb.schema("raw").table("strava_activities").upsert(
            rows, on_conflict="activity_id"
        ).execute()
    log(f"strava extract complete — {len(rows)} activities landed")


if __name__ == "__main__":
    main()
