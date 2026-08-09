# GEO query sets

## Construct from real demand, not a generic prompt list

Build candidate prompts from distinct evidence streams: product/category language, ICP jobs and objections, Search Console queries handed off by `seo`, competitor comparison questions, and high-intent buyer decisions. Record the source for each prompt. Balance prompt types across discovery, problem understanding, category education, comparison, evaluation, and purchase intent; a set made only of branded prompts measures recall, not market visibility.

Every prompt must be natural enough that a real buyer could ask it, specific enough to have a stable intent, and scoped to language and country. Avoid near-duplicates whose only difference is punctuation or a synonym. Include unbranded prompts that give every credible competitor a fair chance to appear.

## Prepare, review, save

`visibility.tracked_prompts.generate` prepares candidates; it does not persist them. Review candidates for duplicates, leading brand bias, unsupported locales, and coverage gaps. `visibility.tracked_prompts.save` persists the chosen batch; `create` adds one explicit prompt; `update` revises one exact prompt. Read the set back after saving and report the stable ids and active count.

Do not generate a new set because metrics are weak. Weak results may be the finding. Revise the measurement instrument only when audience, market, language, product, or question taxonomy changed, and record the reason and effective date.

## Version and comparison rules

Treat additions, removals, activation changes, wording changes, locale changes, and engine coverage changes as query-set revisions. Compare trends only across the unchanged intersection or label the result as a new baseline. Never splice old results for retired wording into a new prompt's history.
