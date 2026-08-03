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

    user = data.get("matchedUser") or {}
    by_diff = {
        row["difficulty"].lower(): row["count"]
        for row in user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])
    }
    recent = (data.get("recentAcSubmissionList") or [None])[0]
    last_at = None
    if recent and recent.get("timestamp"):
        from datetime import datetime, timezone

        last_at = datetime.fromtimestamp(int(recent["timestamp"]), tz=timezone.utc).isoformat()

    sb.schema("mart").table("leetcode_summary").upsert(
        {
            "username": username,
            "easy_solved": by_diff.get("easy", 0),
            "medium_solved": by_diff.get("medium", 0),
            "hard_solved": by_diff.get("hard", 0),
            "total_solved": by_diff.get("all", 0),
            "ranking": (user.get("profile") or {}).get("ranking", 0) or 0,
            "streak": (user.get("userCalendar") or {}).get("streak", 0) or 0,
            "last_submission_title": recent["title"] if recent else None,
            "last_submission_at": last_at,
        }
    ).execute()
    log(f"leetcode extract complete — {by_diff.get('all', 0)} solved")


if __name__ == "__main__":
    main()
