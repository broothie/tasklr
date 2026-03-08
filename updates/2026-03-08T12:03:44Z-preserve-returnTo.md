# ${TS} Preserve returnTo/next across OAuth re-authorize

What I changed

- `server.js`: when initiating OAuth (`GET /auth/google`) the handler now stores a safe `next` or `returnTo` query value in `req.session.returnTo` if it appears to be a relative path (starts with `/` and not `//`). This prevents open redirects.
- `server.js`: after successful OAuth callback (`/auth/callback`) the app redirects to the stored `returnTo` value (if present) and deletes it from the session; otherwise it falls back to `/`.

Why

- The client UI shows a 'Re-authorize' action when the OAuth `tasks` scope is missing. Remembering where the user was headed (for example a particular task list) allows a smoother flow after re-consenting.

Tests performed

- Syntax check: `node --check server.js` passed locally in this environment.
- Manual code inspection verified the stored `returnTo` is validated for safety (only relative paths starting with `/` are stored).

Files changed

- `server.js` — add `returnTo` preservation and safe redirect after callback.

Commit

- `feat(auth): preserve safe returnTo in /auth/google and redirect after callback`

Next steps

- Update the client to attach `?next=/some/path` to `/auth/google` when re-authorizing from a UI context (e.g., when the Tasks-scope banner's Re-authorize button is clicked). This will allow returning users to their intended view.
- Add a small integration test that requests `/auth/google?next=/some/path`, completes the OAuth dance in a test harness (or mocks), and asserts the final redirect goes to `/some/path`.

Turns used for this update: 3/150

Signed-off-by: Codex CLI
