-- Explode the latest top-artists payload per term into ranked rows.
with latest as (
    select term, payload,
           row_number() over (partition by term order by fetched_at desc) as rn
    from {{ source('raw', 'spotify_top_artists') }}
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
    item->>'name'                       as artist_name,
    item->'images'->0->>'url'           as image_url,
    coalesce(
        array(select jsonb_array_elements_text(item->'genres')),
        '{}'
    )                                   as genres,
    item->'external_urls'->>'spotify'   as artist_url
from items
