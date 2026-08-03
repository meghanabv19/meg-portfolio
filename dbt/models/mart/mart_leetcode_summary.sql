-- Latest LeetCode snapshot per user.
{{ config(materialized='table') }}

select
    username, easy_solved, medium_solved, hard_solved, total_solved,
    ranking, streak, last_submission_title, last_submission_at, synced_at
from {{ ref('stg_leetcode_stats') }}
