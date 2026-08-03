-- ============================================================
-- HackerRank tables — incremental migration.
-- Run this in the Supabase SQL editor (safe to re-run).
-- ============================================================

create table if not exists raw.hackerrank_badges (
  id          bigint generated always as identity primary key,
  username    text not null,
  payload     jsonb not null,
  fetched_at  timestamptz not null default now()
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

-- RLS: anon may read the mart tables only.
alter table mart.hackerrank_summary enable row level security;
alter table mart.hackerrank_badges  enable row level security;
drop policy if exists "anon read" on mart.hackerrank_summary;
create policy "anon read" on mart.hackerrank_summary for select to anon, authenticated using (true);
drop policy if exists "anon read" on mart.hackerrank_badges;
create policy "anon read" on mart.hackerrank_badges for select to anon, authenticated using (true);

-- Grants.
grant select on mart.hackerrank_summary, mart.hackerrank_badges to anon, authenticated;
grant all on raw.hackerrank_badges, mart.hackerrank_summary, mart.hackerrank_badges to service_role;
grant usage, select on all sequences in schema raw to service_role;

notify pgrst, 'reload schema';
