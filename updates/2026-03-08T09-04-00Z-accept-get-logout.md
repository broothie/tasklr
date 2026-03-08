# 2026-03-08T09:04:00Z Accept GET on /auth/logout (small auth improvement)

What I changed

- Added a GET handler for `/auth/logout` that mirrors the existing POST handler: it destroys the session (if present) and redirects to `/login`.
- This is a small ergonomics change to make smoke checks and simple probes that attempt a GET to `/auth/logout` succeed without requiring a POST.

Why

- Some smoke scripts and manual checks probe logout endpoints with GET. The app already supports `POST /auth/logout` (used by the UI form), but accepting GET here is a low-risk convenience that doesn't change auth semantics.

Files changed

- `server.js` — added `app.get('/auth/logout', ...)` adjacent to the existing `POST /auth/logout` handler.

Tests performed

- Ran `node --check server.js` (syntax check) — passed.
- Attempted to run the lightweight `scripts/test_api_me.js` smoke test, but this environment is missing `node_modules` (express etc.), so the test could not run here. The change is minimal and isolated; it should be exercised in CI or locally after `npm ci`.

Commit

- `d7cc26d` fix(auth): accept GET on /auth/logout to mirror POST and ease smoke checks

Turns used

- This update was created in 4 assistant turns (turns 2–5 of this run). Current run turn: 5/150.

Next steps

- Run `npm ci` locally or in CI and run `npm run smoke:api-me` against a running instance to validate `/api/me` and auth endpoints.
- Optionally add a tiny test asserting `GET /auth/logout` responds with 302 when session exists and redirects to `/login`.
