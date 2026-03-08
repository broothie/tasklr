# ${TS} Attach current path as `next` when re-authorizing

What I changed

- `views/index.html`: when the client detects the OAuth `tasks` scope is missing it now builds a re-authorize URL that includes the current pathname+search as a `next` query parameter (e.g. `/auth/google?next=/tasklists/XYZ`). The banner's Re-authorize button now points to that URL instead of the bare `/auth/google`.

Why

- The server already preserves a safe `returnTo` value when starting the OAuth flow (`/auth/google`) and redirects to it after a successful callback (see previous update `preserve-returnTo`). Passing the current client path as `next` when the user clicks Re-authorize allows the server to return the user to the view they were on after re-consent.

Tests performed

- Manual code change review to ensure the client constructs only a relative path via `window.location.pathname + window.location.search` and encodes it with `encodeURIComponent`.
- Ran syntax check (`npm run check:syntax`) and unit tests (`npm test`). Both passed.

Files changed

- `views/index.html` — use `const reauthUrl = '/auth/google?next=' + encodeURIComponent(window.location.pathname + window.location.search);` and reference it in the banner HTML.

Next steps

- Add an integration test to exercise `GET /auth/google?next=/some/path` and assert the callback redirects to `/some/path` after an OAuth mock.
- Consider preserving hash fragments (if desired) by adding a client-side storage step before starting OAuth; currently OAuth `next` cannot carry fragments because they are not sent to the server.

Turns used for this update: 12/150

Signed-off-by: Codex CLI
