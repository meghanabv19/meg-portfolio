{{ config(materialized='table') }}

select term, rank, artist_name, image_url, genres, artist_url
from {{ ref('stg_spotify_top_artists') }}
