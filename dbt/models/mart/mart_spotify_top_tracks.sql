{{ config(materialized='table') }}

select term, rank, track_name, artist_name, album_art_url, track_url
from {{ ref('stg_spotify_top_tracks') }}
