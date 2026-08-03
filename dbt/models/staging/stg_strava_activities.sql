-- Normalise Strava activities: metres -> km, seconds -> pace string.
with source as (
    select activity_id, payload
    from {{ source('raw', 'strava_activities') }}
)
select
    activity_id::text                                       as activity_id,
    payload->>'name'                                        as name,
    payload->>'type'                                        as type,
    round((payload->>'distance')::numeric / 1000.0, 2)      as distance_km,
    (payload->>'moving_time')::int                          as moving_time_s,
    case
        when (payload->>'distance')::numeric > 0 and payload->>'type' in ('Run', 'Walk', 'Hike')
        then to_char(
            make_interval(secs => (payload->>'moving_time')::numeric
                                  / ((payload->>'distance')::numeric / 1000.0)),
            'MI:SS'
        )
        else null
    end                                                     as pace_per_km,
    round(coalesce((payload->>'total_elevation_gain')::numeric, 0), 0) as elevation_m,
    (payload->>'start_date')::timestamptz                   as start_date
from source
