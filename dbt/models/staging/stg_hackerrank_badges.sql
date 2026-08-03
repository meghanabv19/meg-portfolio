-- Flatten the latest HackerRank badges payload into one row per badge,
-- plus carry the profile fields needed for the summary mart.
with latest as (
    select username, payload, fetched_at,
           row_number() over (partition by username order by fetched_at desc) as rn
    from {{ source('raw', 'hackerrank_badges') }}
),
current as (
    select username, payload, fetched_at from latest where rn = 1
),
badges as (
    select
        c.username,
        c.fetched_at,
        c.payload->'profile'->>'name'                      as profile_name,
        coalesce((c.payload->'profile'->>'level')::int, 0)  as profile_level,
        c.payload->'profile'->>'country'                    as profile_country,
        b as badge
    from current c,
         lateral jsonb_array_elements(c.payload->'badges'->'models') as b
)
select
    username,
    profile_name,
    profile_level,
    profile_country,
    badge->>'badge_name'                          as badge_name,
    badge->>'badge_type'                          as badge_type,
    coalesce((badge->>'stars')::int, 0)           as stars,
    coalesce((badge->>'total_stars')::int, 0)     as max_stars,
    coalesce((badge->>'solved')::int, 0)          as solved,
    round(coalesce((badge->>'current_points')::numeric, 0), 1) as points,
    fetched_at                                    as synced_at
from badges
