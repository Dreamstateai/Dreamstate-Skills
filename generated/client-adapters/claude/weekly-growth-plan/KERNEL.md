# Weekly cross-channel growth plan
<!-- architect-operation-contract
{"required_capability_ids":["brain.context.get","brain.context.search","calendar.events_create","calendar.events_list","command_center.action_items.list","command_center.feed.list","command_center.goals.get","command_center.overview.get","content.article_list","content.artifact_list","gtm.goals_list","gtm.tasks.list","outreach.workspace_stats_get","record_files.list","record_files.upload","records.get","sequences.list","social.analytics_query","social.strategy_activity_calendar","social.strategy_overview","social.strategy_plan_progress","social.weekly_plan_items_list","tasks.create","tasks.get","visibility.overview","workbooks.list","workflows.list"]}
-->

Build one evidence-backed operating plan for the next week across the channels the user selects. This is a prioritization and delegation layer, not a social calendar and not an execution shortcut.

Inspect current goals, published cited workspace-wiki strategy, active outreach workflows and content calendars, measured performance, open review items, capacity, deadlines, and active surface. Ask one structured popup only when a missing priority, capacity, owner, or risk tolerance materially changes the week.

Produce one diagnosis and three to five ranked priorities. Each priority names the outcome, evidence, owner, exact deliverable, channel, dependency, due date, measure, review gate, and smallest useful next action. Explain why lower-ranked work is deferred. Distinguish an authored-content schedule from Reddit community engagement, outreach, visibility, blog, and buyer-facing assets.

Use live capability search/get to determine what can be read, proposed, persisted, or executed. The weekly plan itself must not silently run delegated work. When the user asks to continue, load the smallest owning skill for each accepted priority and preserve one shared objective so delegates do not duplicate artifacts. Consequence approvals remain inside the owning skill.

When the user explicitly asks to coordinate a follow-up across the calendar, task system, and customer record, this skill owns the cross-surface transaction. Create the exact meeting and owner task through their canonical capabilities, attach the briefing to the resolved record, honor every required proposal or approval, and read all three surfaces back before claiming completion. Never substitute a plan for the requested durable actions.

Return the reviewable plan, evidence and assumptions, capacity allocation, delegated skill ids, measurement loop, and end-of-week review criteria. State clearly which items are only planned and which have separate durable proposals or runs.
