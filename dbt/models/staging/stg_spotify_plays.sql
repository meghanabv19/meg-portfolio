-- Flatten the raw Spotify play payload into typed columns, one row per fetch.
with source as (
    select payload, fetched_at
    from {{ source('raw', 'spotify_plays') }}
)
select
    payload->'item'->>'name'                                    as track_name,
    payload->'item'->'artists'->0->>'name'                      as artist_name,
    payload->'item'->'album'->>'name'                           as album_name,
    payload->'item'->'album'->'images'->0->>'url'               as album_art_url,
    payload->'item'->'external_urls'->>'spotify'                as track_url,
    coalesce((payload->>'is_playing')::boolean, false)          as is_playing,
    case
        when payload->>'timestamp' ~ '^[0-9]+$'
            then to_timestamp((payload->>'timestamp')::bigint / 1000)
        else (payload->>'timestamp')::timestamptz
    end                                                         as played_at,
    fetched_at                                                  as synced_at
from source
where payload->'item'->>'name' is not null
