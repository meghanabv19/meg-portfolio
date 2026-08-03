-- Location visits are already filtered + deduped by load_google_maps.py.
-- Staging just enforces types and drops any accidental nulls.
select
    place_name,
    coalesce(city, 'Unknown')     as city,
    country,
    lat,
    lng,
    coalesce(category, 'LANDMARK') as category,
    visited_at::date              as visited_at
from {{ source('raw', 'location_visits') }}
where lat is not null and lng is not null
