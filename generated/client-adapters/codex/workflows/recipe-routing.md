# Recipe-first semantic routing

Convert the request into a routing frame:

- outcome: observe, enrich, qualify, notify, enroll, or send;
- subject: person, company, event, selection, conversation;
- trigger: event, schedule, manual, child workflow;
- effects and consequence class;
- required gates and terminal exits;
- recurrence and expected recovery behavior.

Compare this frame with existing workflows and `workflows.node_registry`. A recipe matches only when its declared trigger, entity type, required inputs, and effect class align. Names and lexical overlap are secondary evidence.

Prefer, in order: exact existing recipe; existing recipe with safe draft-only parameter edits; smallest composable graph using a child workflow; new graph. Do not duplicate an active recipe because the user phrased the task differently.

If two candidates remain, show the one material semantic difference and ask one choice. Never collect parameters the selected recipe can request at runtime.
