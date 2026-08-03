{{ config(materialized='table') }}

select
    username, badge_name, badge_type, stars, max_stars, solved, points
from {{ ref('stg_hackerrank_badges') }}
