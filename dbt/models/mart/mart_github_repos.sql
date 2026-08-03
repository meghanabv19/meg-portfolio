-- Non-fork repos, most recently pushed first.
{{ config(materialized='table') }}

with g as (
    select * from {{ ref('stg_github') }}
)
select
    r->>'name'                                    as name,
    r->>'description'                             as description,
    r->>'language'                               as language,
    coalesce((r->>'stargazers_count')::int, 0)   as stars,
    (r->>'pushed_at')::timestamptz               as pushed_at,
    r->>'html_url'                               as url
from g, lateral jsonb_array_elements(g.payload->'repos') as r
where coalesce((r->>'fork')::boolean, false) = false
order by (r->>'pushed_at')::timestamptz desc
