# Input columns: from your data to a Dreamstate table

Dreamstate stores leads as a Clay-style table: **one row per person**, with built-in
contact fields plus any custom columns you add. When you bring your own data (a CSV, a
paste, a CRM export), the agent maps your headers onto Dreamstate fields, creates a row
per person, and enriches the rest. This file is the mapping reference.

## The one hard requirement

Only a **name** is truly required to create a row — either a single `name`, or
`first_name` + `last_name`. A `linkedin_url` makes enrichment and sending far more
reliable, so include it when you have it. Everything else is optional: the
`/enrich-list` skill fills firmographics via `outreach_enrich_contact`, and any field you
care about can live in a custom column.

## Common input columns

| Your column (any of these) | Maps to | Notes |
|---|---|---|
| `name`, `full_name` | contact name | or split into first/last |
| `first_name`, `last_name` | contact name | preferred if you have both |
| `linkedin_url`, `profile_url`, `linkedin` | LinkedIn profile | best key for enrich + send |
| `email`, `work_email` | email | optional; LinkedIn is the primary channel |
| `title`, `job_title`, `role` | title | enriched if missing |
| `company`, `company_name`, `account` | company | enriched if missing |
| `company_domain`, `website` | company domain | helps enrichment resolve the firm |
| `industry`, `vertical` | industry | enriched if missing |
| `employee_count`, `company_size` | company size | enriched if missing |
| `location`, `city`, `country` | location | used for ICP geography filtering |
| anything else you care about | a **custom column** | added with `outreach_add_column`, written with `outreach_set_cell` |

## How the agent uses it

1. **Map** your headers to the fields above (it confirms ambiguous ones with you).
2. **Create** a row per person in a Dreamstate list (`outreach_create_list`, then a row +
   `outreach_set_cell` for each known field).
3. **Add custom columns** for the values you brought that don't map to a built-in field,
   and for the ones the pipeline writes back: `icp_fit` and `fit_reason`
   (`/lead-prioritizer`), `opener` (`/hook-writer`).
4. **Enrich** the gaps (`/enrich-list`), bounded by your daily spend cap.

The result is a single table the whole pipeline reads and writes — the same surface you
see in the Dreamstate UI.
