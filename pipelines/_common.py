"""Shared helpers for extraction pipelines.

Every pipeline follows the same contract:
  1. get a short-lived access token (OAuth refresh) or hit a public endpoint
  2. pull the API response
  3. upsert raw JSON into the Supabase `raw` schema

dbt (run separately) transforms raw -> staging -> mart.
"""
from __future__ import annotations

import os
import sys

import requests
from supabase import Client, create_client


def env(name: str, required: bool = True) -> str:
    val = os.environ.get(name, "")
    if required and not val:
        print(f"[fatal] missing env var: {name}", file=sys.stderr)
        sys.exit(1)
    return val


def supabase() -> Client:
    """Service-role client — write access to raw + mart. Pipelines only."""
    url = env("SUPABASE_URL")
    key = env("SUPABASE_SERVICE_KEY")
    return create_client(url, key)


def refresh_oauth_token(token_url: str, client_id: str, client_secret: str, refresh_token: str) -> str:
    """Exchange a refresh token for a fresh access token (Spotify + Strava)."""
    resp = requests.post(
        token_url,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": client_id,
            "client_secret": client_secret,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def log(msg: str) -> None:
    print(f"[pipeline] {msg}", flush=True)
