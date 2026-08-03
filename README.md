# Meghana BV — Portfolio + Live Data Platform

A personal portfolio for a data engineer that is *also* a working data platform.
Every widget is fed by a real pipeline: a scheduled job extracts from an API,
lands raw JSON in Postgres, dbt transforms `raw → staging → mart`, and Next.js
reads the tested mart tables.

Dark, minimal, terminal/log aesthetic. Keyboard-navigable.

```
API ─▶ GitHub Actions (cron) ─▶ Python extract ─▶ raw.* (Supabase)
                                              └▶ dbt (staging → mart) ─▶ mart.*
                                                                          └▶ Next.js (Vercel) ─▶ widget
```

## Stack

| Layer          | Tool                              |
| -------------- | --------------------------------- |
| Frontend       | Next.js 14 (App Router) + Tailwind |
| Hosting        | Vercel (free tier)                |
| Database       | Supabase (Postgres, free tier)    |
| Orchestration  | GitHub Actions (cron)             |
| Transformation | dbt Core                          |
| Extraction     | Python                            |
| Maps           | Google Maps JavaScript API        |
| Auth           | Spotify OAuth 2.0, Strava OAuth 2.0 |

## Sections

Home (live feed) · About (professional profile) · Spotify · Strava · Coding (LeetCode) · Maps · Architecture.

The site renders **immediately with bundled sample data** — real data takes over
automatically once the Supabase mart tables are populated. Stale/missing tables
fall back to cached data with an amber indicator.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in what you have; blanks are fine for a first run
npm run dev                  # http://localhost:3000
```

With no env vars set, every section shows sample data (labelled honestly).

## Data platform setup

1. **Supabase** — create a project, run `supabase/schema.sql` in the SQL editor.
   Settings → API → add `mart` to "Exposed schemas".
2. **Secrets** (GitHub repo → Settings → Secrets → Actions, and Vercel env):
   see `.env.example`. Mint OAuth refresh tokens with
   `python pipelines/get_refresh_tokens.py spotify|strava`.
3. **dbt** — needs the direct Postgres connection (Supabase → Settings → Database):
   `SUPABASE_DB_HOST/PORT/USER/PASSWORD/NAME`.
4. **Pipelines** run automatically on their crons; trigger manually from the
   Actions tab (`workflow_dispatch`).

### Environment variables

**Pipelines / dbt (GitHub Actions secrets):**
`SPOTIFY_CLIENT_ID` · `SPOTIFY_CLIENT_SECRET` · `SPOTIFY_REFRESH_TOKEN` ·
`STRAVA_CLIENT_ID` · `STRAVA_CLIENT_SECRET` · `STRAVA_REFRESH_TOKEN` ·
`LEETCODE_USERNAME` · `SUPABASE_URL` · `SUPABASE_SERVICE_KEY` ·
`SUPABASE_DB_HOST/PORT/USER/PASSWORD/NAME`

**Site (Vercel / `.env.local`, browser-safe):**
`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` ·
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` · `NEXT_PUBLIC_GITHUB_REPO`

## Google Maps privacy

`load_google_maps.py` parses a Google Takeout export locally and keeps **only**
tourist places (museums, parks, landmarks, attractions, or confidence > 0.8).
Home, commute and daily locations are discarded before anything is written.
Raw location history is never committed or stored on the server.

## Pipelines

| Pipeline  | Schedule        | Script                | Mart                                    |
| --------- | --------------- | --------------------- | --------------------------------------- |
| Spotify   | every 30 min    | `extract_spotify.py`  | `spotify_now_playing/top_tracks/top_artists` |
| Strava    | every 6 hours   | `extract_strava.py`   | `strava_recent`, `strava_stats`         |
| LeetCode  | daily @ 00:00   | `extract_leetcode.py` | `leetcode_summary`                      |
| Maps      | manual          | `load_google_maps.py` | `tourist_places`                        |

## Deploy

Push to GitHub → import into Vercel → set the `NEXT_PUBLIC_*` env vars → deploy.
Add the pipeline/dbt secrets to the repo so Actions can run.

---

BUILD 26.07 // CRAFTED BY MEG
