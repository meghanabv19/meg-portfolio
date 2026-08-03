-- ============================================================
-- Supabase / Postgres schema for the portfolio data platform.
-- Run once in the Supabase SQL editor (or via `psql`).
--
--   raw.*   landing zone written by pipelines (service key)
--   mart.*  clean, tested tables read by the site (anon key)
--
-- staging models are ephemeral dbt views — no DDL needed here.
-- ============================================================

create schema if not exists raw;
create schema if not exists mart;

-- ---------- RAW (loose types, JSONB payloads) ----------

create table if not exists raw.spotify_plays (
  id           bigint generated always as identity primary key,
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.spotify_top_tracks (
  id           bigint generated always as identity primary key,
  term         text not null,               -- short_term | medium_term | long_term
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.spotify_top_artists (
  id           bigint generated always as identity primary key,
  term         text not null,
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.strava_activities (
  activity_id  bigint primary key,
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.leetcode_stats (
  id           bigint generated always as identity primary key,
  username     text not null,
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.hackerrank_badges (
  id           bigint generated always as identity primary key,
  username     text not null,
  payload      jsonb not null,
  fetched_at   timestamptz not null default now()
);

create table if not exists raw.location_visits (
  id           bigint generated always as identity primary key,
  place_name   text not null,
  city         text,
  country      text,
  lat          double precision not null,
  lng          double precision not null,
  category     text,
  visited_at   date,
  unique (place_name, lat, lng)
);

-- ---------- MART (typed, what the site reads) ----------
-- dbt owns these as tables; DDL below documents the contract and lets the
-- site read before the first dbt run.

create table if not exists mart.spotify_now_playing (
  id            int primary key default 1,
  is_playing    boolean not null default false,
  track_name    text not null,
  artist_name   text not null,
  album_name    text,
  album_art_url text,
  track_url     text,
  played_at     timestamptz,
  synced_at     timestamptz not null default now()
);

create table if not exists mart.spotify_top_tracks (
  term          text not null,
  rank          int not null,
  track_name    text not null,
  artist_name   text not null,
  album_art_url text,
  track_url     text,
  primary key (term, rank)
);

create table if not exists mart.spotify_top_artists (
  term          text not null,
  rank          int not null,
  artist_name   text not null,
  image_url     text,
  genres        text[] default '{}',
  artist_url    text,
  primary key (term, rank)
);

create table if not exists mart.strava_recent (
  activity_id   text primary key,
  name          text,
  type          text not null,
  distance_km   numeric not null,
  moving_time_s int not null,
  pace_per_km   text,
  elevation_m   numeric not null default 0,
  start_date    timestamptz not null
);

create table if not exists mart.strava_stats (
  period        text primary key,           -- week | month
  activities    int not null default 0,
  distance_km   numeric not null default 0,
  moving_time_s int not null default 0,
  elevation_m   numeric not null default 0,
  synced_at     timestamptz not null default now()
);

create table if not exists mart.leetcode_summary (
  username             text not null,
  easy_solved          int not null default 0,
  medium_solved        int not null default 0,
  hard_solved          int not null default 0,
  total_solved         int not null default 0,
  ranking              int not null default 0,
  streak               int not null default 0,
  last_submission_title text,
  last_submission_at   timestamptz,
  synced_at            timestamptz not null default now(),
  primary key (username, synced_at)
);

create table if not exists mart.hackerrank_summary (
  username      text primary key,
  name          text,
  level         int not null default 0,
  country       text,
  total_badges  int not null default 0,
  total_stars   int not null default 0,
  top_badge     text,
  synced_at     timestamptz not null default now()
);

create table if not exists mart.hackerrank_badges (
  username    text not null,
  badge_name  text not null,
  badge_type  text,
  stars       int not null default 0,
  max_stars   int not null default 0,
  solved      int not null default 0,
  points      numeric not null default 0,
  primary key (username, badge_name)
);

create table if not exists mart.tourist_places (
  place_name    text not null,
  city          text not null,
  country       text,
  lat           double precision not null,
  lng           double precision not null,
  category      text not null,
  first_visited date not null,
  primary key (place_name, lat, lng)
);

-- ---------- Row Level Security: anon may READ mart only ----------
alter table mart.spotify_now_playing enable row level security;
alter table mart.spotify_top_tracks  enable row level security;
alter table mart.spotify_top_artists enable row level security;
alter table mart.strava_recent       enable row level security;
alter table mart.strava_stats        enable row level security;
alter table mart.leetcode_summary    enable row level security;
alter table mart.hackerrank_summary  enable row level security;
alter table mart.hackerrank_badges   enable row level security;
alter table mart.tourist_places      enable row level security;

-- CREATE POLICY has no IF NOT EXISTS — drop then create so this is re-runnable.
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'mart'
  loop
    execute format('drop policy if exists "anon read" on mart.%I;', t);
    execute format('create policy "anon read" on mart.%I for select to anon, authenticated using (true);', t);
  end loop;
end $$;

-- ---------- Grants ----------
-- Site (anon/authenticated): read-only on mart.
grant usage on schema mart to anon, authenticated;
grant select on all tables in schema mart to anon, authenticated;
alter default privileges in schema mart grant select on tables to anon, authenticated;

-- Pipelines (service_role, via REST): read/write on raw + mart.
grant usage on schema raw, mart to service_role;
grant all on all tables in schema raw to service_role;
grant all on all tables in schema mart to service_role;
grant usage, select on all sequences in schema raw to service_role;
alter default privileges in schema raw  grant all on tables to service_role;
alter default privileges in schema mart grant all on tables to service_role;

-- Reload PostgREST so it picks up the new tables immediately.
notify pgrst, 'reload schema';
