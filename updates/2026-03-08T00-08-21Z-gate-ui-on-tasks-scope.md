# {ts}: Gate UI on Tasks OAuth scope (frontend)

Summary

- Detect OAuth token scopes returned by `GET /api/me` and prevent the client from making Task API calls when the Tasks scope is not present.
- Show a clear banner and keep the UI in a safe, read-only state when `https://www.googleapis.com/auth/tasks` is missing.

What I changed

- `views/index.html` — updated the `init()` flow to fetch `/api/me` first, parse `tokens.scopes`, and if the Tasks scope is absent show a banner and abort further initialization that would call `/api/tasklists` and other Tasks APIs.

Why

- Recent server work exposes `tokens.scopes` via `/api/me`. The frontend should respect granted scopes and avoid performing calls the server will reject or that would confuse users when the permission is missing.

Tests performed

- Manual inspection and local static JS edit. This environment does not install `node_modules` so I did not run `npm start` or integration tests that start the server. Changes are limited to client-side JS and are low-risk.

Next steps

- Add a sign-out / re-authorize button to make re-granting the Tasks scope easy for users.
- Consider enabling a lightweight client-side test that mocks `/api/me` payloads to assert UI behavior.

Turns used for this update: 10/150

Signed-off-by: Codex CLI
