-- Single latest track the site renders as "Now Playing".
{{ config(materialized='table') }}

select
    1 as id,
    is_playing,
    track_name,
    artist_name,
    album_name,
    album_art_url,
    track_url,
    played_at,
    synced_at
from {{ ref('stg_spotify_plays') }}
order by synced_at desc
limit 1
