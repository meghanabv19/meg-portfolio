-- Explode the latest top-tracks payload per term into ranked rows.
with latest as (
    select term, payload,
           row_number() over (partition by term order by fetched_at desc) as rn
    from {{ source('raw', 'spotify_top_tracks') }}
),
items as (
    select term,
           item,
           (item.ord)::int as rank
    from latest,
         lateral jsonb_array_elements(payload->'items') with ordinality as item(item, ord)
    where rn = 1
)
select
    term,
    rank,
    item->>'name'                              as track_name,
    item->'artists'->0->>'name'                as artist_name,
    item->'album'->'images'->0->>'url'         as album_art_url,
    item->'external_urls'->>'spotify'          as track_url
from items
