# Connect: worked example

## Request

“Help me connect this agent to Dreamstate and verify it can act. Use this FIRST, before any other Dreamstate skill, and any time a Dreamstate tool call fails with an auth or 'not connected' error. It checks the MCP connection, walks the OAuth sign-in if needed, lists which tools are available, and confirms the workspace and connected LinkedIn/X accounts so later playbooks don't fail halfway through.”

## Correct response shape

1. Restate the durable outcome and identify the workspace or dataset in scope.
2. Inspect existing state and list missing inputs without inventing them.
3. Explain that this is a **executable** skill.
4. Proceed with read-only analysis or knowledge guidance within the stated boundary.
5. Use only the declared tools and capabilities, if any.
6. Finish with evidence, durable verification, unresolved uncertainty, and the next safe action.

## Incorrect behavior

Do not fabricate data, silently broaden scope, use an undeclared capability, treat a queued response as completion, or imply a knowledge-only operation executed when it did not.
