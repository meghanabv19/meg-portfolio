"""HackerRank extract — runs daily in GitHub Actions.

Uses HackerRank's public REST endpoints (no auth). Pulls badges + profile,
lands the raw response into raw.hackerrank_badges, and upserts convenience
rows into mart.hackerrank_summary + mart.hackerrank_badges so the site works
before dbt runs.
"""
from __future__ import annotations

import requests

from _common import env, log, supabase

API = "https://www.hackerrank.com"
HEADERS = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}


def get(url: str) -> dict:
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.json()


def main() -> None:
    username = env("HACKERRANK_USERNAME")
    sb = supabase()

    badges = get(f"{API}/rest/hackers/{username}/badges")
    profile = get(f"{API}/rest/contests/master/hackers/{username}/profile").get("model", {})

    sb.schema("raw").table("hackerrank_badges").insert(
        {"username": username, "payload": {"badges": badges, "profile": profile}}
    ).execute()

    models = badges.get("models", [])
    rows = [
        {
            "username": username,
            "badge_name": m["badge_name"],
            "badge_type": m.get("badge_type"),
            "stars": m.get("stars", 0) or 0,
            "max_stars": m.get("total_stars", 0) or 0,
            "solved": m.get("solved", 0) or 0,
            "points": round(m.get("current_points", 0) or 0, 1),
        }
        for m in models
    ]
    if rows:
        sb.schema("mart").table("hackerrank_badges").upsert(
            rows, on_conflict="username,badge_name"
        ).execute()

    top = max(models, key=lambda m: (m.get("stars", 0), m.get("current_points", 0)), default=None)
    total_stars = sum(m.get("stars", 0) or 0 for m in models)
    sb.schema("mart").table("hackerrank_summary").upsert(
        {
            "username": username,
            "name": profile.get("name"),
            "level": profile.get("level", 0) or 0,
            "country": profile.get("country"),
            "total_badges": len(models),
            "total_stars": total_stars,
            "top_badge": top["badge_name"] if top else None,
        }
    ).execute()

    log(f"hackerrank extract complete — {len(models)} badges, {total_stars} stars")


if __name__ == "__main__":
    main()
