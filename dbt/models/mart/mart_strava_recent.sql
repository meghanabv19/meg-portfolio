-- Most recent activities, newest first.
{{ config(materialized='table') }}

select
    activity_id, name, type, distance_km, moving_time_s,
    pace_per_km, elevation_m, start_date
from {{ ref('stg_strava_activities') }}
order by start_date desc
limit 30
