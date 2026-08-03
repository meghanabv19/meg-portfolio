"""LeetCode extract — runs daily in GitHub Actions.

Uses the public LeetCode GraphQL endpoint (no auth). Lands the raw response
into raw.leetcode_stats. Also upserts mart.leetcode_summary as a convenience
so the site has data before dbt runs.
"""
from __future__ import annotations

import requests

from _common import env, log, supabase

GRAPHQL = "https://leetcode.com/graphql"

QUERY = """
query userData($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
    userCalendar { streak }
  }
  recentAcSubmissionList(username: $username, limit: 1) {
    title
    timestamp
  }
}
"""


def fetch(username: str) -> dict:
    resp = requests.post(
        GRAPHQL,
        json={"query": QUERY, "variables": {"username": username}},
        headers={
            "Content-Type": "application/json",
            "Referer": f"https://leetcode.com/u/{username}/",
            "User-Agent": "meg-portfolio-pipeline/1.0",
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["data"]


def main() -> None:
    username = env("LEETCODE_USERNAME")
    sb = supabase()

    data = fetch(username)
    sb.schema("raw").table("leetcode_stats").insert(
        {"username": username, "payload": data}
    ).execute()

    # mart tables are owned by dbt (stg_leetcode_stats -> mart.leetcode_summary).
    user = data.get("matchedUser") or {}
    total = next(
        (r["count"] for r in user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])
         if r["difficulty"] == "All"),
        0,
    )
    log(f"leetcode extract complete — {total} solved landed in raw")


if __name__ == "__main__":
    main()
