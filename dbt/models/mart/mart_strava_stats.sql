-- Weekly and monthly rollups (rolling window from now).
{{ config(materialized='table') }}

with base as (
    select * from {{ ref('stg_strava_activities') }}
),
week as (
    select 'week'::text as period,
           count(*)::int as activities,
           round(coalesce(sum(distance_km), 0), 1) as distance_km,
           coalesce(sum(moving_time_s), 0)::int as moving_time_s,
           coalesce(sum(elevation_m), 0) as elevation_m
    from base
    where start_date >= now() - interval '7 days'
),
month as (
    select 'month'::text as period,
           count(*)::int as activities,
           round(coalesce(sum(distance_km), 0), 1) as distance_km,
           coalesce(sum(moving_time_s), 0)::int as moving_time_s,
           coalesce(sum(elevation_m), 0) as elevation_m
    from base
    where start_date >= now() - interval '30 days'
)
select period, activities, distance_km, moving_time_s, elevation_m, now() as synced_at
from week
union all
select period, activities, distance_km, moving_time_s, elevation_m, now() as synced_at
from month
