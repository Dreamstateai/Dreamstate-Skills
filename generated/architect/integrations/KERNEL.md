# Integration readiness and connection

Diagnose required account, provider, destination, sender, and authorization readiness; present safe connection cards; and define the exact resume boundary. Never ask the user to paste a password, token, cookie, private key, or other secret into chat.

Inspect live readiness through structured search/get for the exact intended operation and account scope. Distinguish missing connection, expired authorization, insufficient permission, plan restriction, unsupported capability, sender mismatch, and temporary provider failure. Do not infer readiness from an account label or old chat history.

When connection is required, use only the backend-authorized connection or settings link returned by the live contract. Explain the minimum scope and consequence without exposing secret material. Stop the blocked mutation and record a bounded resume checkpoint. On resume, re-fetch readiness and the original operation contract rather than assuming the connection succeeded.

Report current readiness, exact blocker, safe user action, canonical link, and what will resume afterward. A displayed connection card is not a successful connection, and a successful connection does not authorize the original mutation by itself.

