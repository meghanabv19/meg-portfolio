-- One summary row per user: level, badge counts, star total, top badge.
{{ config(materialized='table') }}

with b as (
    select * from {{ ref('stg_hackerrank_badges') }}
),
top_badge as (
    select distinct on (username)
        username, badge_name as top_badge
    from b
    order by username, stars desc, points desc
)
select
    b.username,
    max(b.profile_name)            as name,
    max(b.profile_level)           as level,
    max(b.profile_country)         as country,
    count(*)::int                  as total_badges,
    sum(b.stars)::int              as total_stars,
    max(t.top_badge)               as top_badge,
    max(b.synced_at)               as synced_at
from b
left join top_badge t on t.username = b.username
group by b.username
