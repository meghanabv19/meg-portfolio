-- Latest GitHub payload per user.
with latest as (
    select username, payload, fetched_at,
           row_number() over (partition by username order by fetched_at desc) as rn
    from {{ source('raw', 'github_stats') }}
)
select username, payload, fetched_at as synced_at
from latest
where rn = 1
