-- Tourist places for the map. First-visited date per unique place.
{{ config(materialized='table') }}

select
    place_name,
    city,
    country,
    lat,
    lng,
    category,
    min(visited_at) as first_visited
from {{ ref('stg_location_visits') }}
group by place_name, city, country, lat, lng, category
