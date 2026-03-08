# 2026-03-08T03-46-29Z Add re-authorize and sign-out actions to Tasks-scope banner

What I changed

- When `/api/me` indicates the OAuth `tasks` scope is missing, the client previously showed a passive banner asking the user to "sign out and sign in again". I improved the banner to include two actions:
  - **Re-authorize** — a primary button that navigates to `/auth/google` to trigger OAuth consent again (the server already requests `prompt: 'consent'`).
  - **Sign out** — a small form that posts to `/auth/logout` so the user can sign out immediately.

Why

- This makes it easier for users to restore the required permission without hunting for the header sign-out button.

Files changed

- `views/index.html` — replaced the scope-warning banner text with actionable buttons.

Tests performed

- Verified the HTML replacement was applied to `views/index.html` (static file edit). I did not start the server because `node_modules` are not installed in this environment; to validate end-to-end run locally:

```
npm ci
npm start
# Sign in with a Google account missing Tasks scope or remove Tasks scope manually and visit the app
```

Turns used

- This update was created in 3 assistant turns (turns 2–4 of this run). Current run turn: 4/150.

Next steps

- Add a small automated smoke test that fetches `/api/me` and asserts the UI shows the banner and that `/auth/google` and `/auth/logout` endpoints exist.
- Optionally add a 'Re-authorize' flow that preserves the user's intended redirect/list selection after reconsent.

