-- One summary row: repos, followers, contributions this year, top language.
{{ config(materialized='table') }}

with g as (
    select * from {{ ref('stg_github') }}
),
langs as (
    select g.username, r->>'language' as language, count(*) as c
    from g, lateral jsonb_array_elements(g.payload->'repos') as r
    where r->>'language' is not null
      and coalesce((r->>'fork')::boolean, false) = false
    group by g.username, r->>'language'
),
top as (
    select distinct on (username) username, language as top_language
    from langs
    order by username, c desc
)
select
    g.username,
    g.payload->'profile'->>'name'                              as name,
    coalesce((g.payload->'profile'->>'public_repos')::int, 0)  as public_repos,
    coalesce((g.payload->'profile'->>'followers')::int, 0)     as followers,
    coalesce((g.payload->>'total_contributions')::int, 0)      as contributions,
    t.top_language,
    g.synced_at
from g
left join top t on t.username = g.username
