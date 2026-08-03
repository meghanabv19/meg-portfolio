{# Strip the "mart_" prefix from mart model names so they materialize as the
   table names the site actually reads (mart.leetcode_summary, not
   mart.mart_leetcode_summary). Staging models (stg_*) keep their names. #}
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name -%}
        {{ custom_alias_name | trim }}
    {%- elif node is not none and node.name.startswith('mart_') -%}
        {{ node.name[5:] }}
    {%- elif node is not none -%}
        {{ node.name }}
    {%- else -%}
        {{ custom_alias_name }}
    {%- endif -%}
{%- endmacro %}
