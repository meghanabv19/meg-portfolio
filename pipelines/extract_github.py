"""GitHub extract — runs daily in GitHub Actions.

Public REST (profile + repos) plus GraphQL (contributions this year, needs a
token — Actions provides GITHUB_TOKEN automatically). Lands raw JSON into
raw.github_stats; dbt builds mart.github_summary + mart.github_repos.
"""
from __future__ import annotations

import os

import requests

from _common import env, log, supabase

API = "https://api.github.com"
GRAPHQL = "https://api.github.com/graphql"


def headers() -> dict:
    h = {"Accept": "application/vnd.github+json", "User-Agent": "meg-portfolio"}
    tok = os.environ.get("GITHUB_TOKEN", "")
    if tok:
        h["Authorization"] = f"Bearer {tok}"
    return h


def rest(path: str):
    r = requests.get(f"{API}{path}", headers=headers(), timeout=30)
    r.raise_for_status()
    return r.json()


def contributions(username: str, token: str) -> int:
    if not token:
        return 0
    q = ("query($u:String!){ user(login:$u){ contributionsCollection{"
         " contributionCalendar{ totalContributions } } } }")
    r = requests.post(
        GRAPHQL,
        json={"query": q, "variables": {"u": username}},
        headers={"Authorization": f"Bearer {token}", "User-Agent": "meg-portfolio"},
        timeout=30,
    )
    if r.status_code != 200:
        return 0
    data = r.json().get("data") or {}
    cal = (((data.get("user") or {}).get("contributionsCollection") or {})
           .get("contributionCalendar") or {})
    return cal.get("totalContributions", 0)


def main() -> None:
    username = env("GITHUB_USERNAME")
    token = os.environ.get("GITHUB_TOKEN", "")
    sb = supabase()

    profile = rest(f"/users/{username}")
    repos = rest(f"/users/{username}/repos?per_page=100&sort=pushed")
    total = contributions(username, token)

    payload = {"profile": profile, "repos": repos, "total_contributions": total}
    sb.schema("raw").table("github_stats").insert(
        {"username": username, "payload": payload}
    ).execute()
    log(f"github extract complete — {profile.get('public_repos')} repos, {total} contributions")


if __name__ == "__main__":
    main()
