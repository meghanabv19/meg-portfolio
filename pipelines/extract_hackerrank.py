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

    # mart tables are owned by dbt (stg_hackerrank_badges -> mart.hackerrank_*).
    models = badges.get("models", [])
    total_stars = sum(m.get("stars", 0) or 0 for m in models)
    log(f"hackerrank extract complete — {len(models)} badges, {total_stars} stars landed in raw")


if __name__ == "__main__":
    main()
