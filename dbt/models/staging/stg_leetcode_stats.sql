-- Flatten the latest LeetCode GraphQL snapshot into one row.
with latest as (
    select username, payload, fetched_at,
           row_number() over (partition by username order by fetched_at desc) as rn
    from {{ source('raw', 'leetcode_stats') }}
),
diffs as (
    select
        username, payload, fetched_at,
        (
            select jsonb_object_agg(lower(d->>'difficulty'), (d->>'count')::int)
            from jsonb_array_elements(
                payload->'matchedUser'->'submitStatsGlobal'->'acSubmissionNum'
            ) as d
        ) as by_diff
    from latest
    where rn = 1
)
select
    username,
    coalesce((by_diff->>'easy')::int, 0)    as easy_solved,
    coalesce((by_diff->>'medium')::int, 0)  as medium_solved,
    coalesce((by_diff->>'hard')::int, 0)    as hard_solved,
    coalesce((by_diff->>'all')::int, 0)     as total_solved,
    coalesce((payload->'matchedUser'->'profile'->>'ranking')::int, 0)   as ranking,
    coalesce((payload->'matchedUser'->'userCalendar'->>'streak')::int, 0) as streak,
    payload->'recentAcSubmissionList'->0->>'title'                      as last_submission_title,
    case
        when payload->'recentAcSubmissionList'->0->>'timestamp' ~ '^[0-9]+$'
        then to_timestamp((payload->'recentAcSubmissionList'->0->>'timestamp')::bigint)
        else null
    end                                                                as last_submission_at,
    fetched_at                                                         as synced_at
from diffs
