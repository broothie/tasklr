# ${TS} Add smoke test for /api/me and auth endpoints

What I changed

- Added `scripts/smoke-api-me.sh` a small, dependency-free shell smoke test that:
  - GETs `/api/me` and asserts HTTP 200.
  - Performs lightweight checks for JSON keys `scopes` or `user`.
  - Verifies `/auth/google` responds with 200/302/303.
  - Verifies `POST /auth/logout` responds with 200/302/303.
- Added an npm script `smoke:api-me` in `package.json` that runs the shell script: `bash scripts/smoke-api-me.sh`.

Why

- The previous update suggested adding a smoke test that checks the `api/me` behaviour and presence of auth endpoints. This provides a quick CI/local check to ensure the server exposes the expected endpoints before attempting UI-level checks.

How to run

- Start the app (defaults to `http://localhost:3000`):

```
npm ci
npm start
# in another shell
npm run smoke:api-me
```

- Or set `BASE_URL` to point at a running instance: `BASE_URL=https://example.com npm run smoke:api-me`.

Tests performed

- Created the script and validated it is executable.
- Committed the files. I did not run the smoke test here because the server is not running in this environment.

Files changed

- `scripts/smoke-api-me.sh` — new executable smoke test script.
- `package.json` — added `smoke:api-me` npm script.

Commit

- `0ae768c` test: add smoke API /api/me and auth endpoints check (scripts/smoke-api-me.sh, package.json)

Turns used

- This update was created in 2 assistant turns (turns 5–6 of this run). Current run turn: 6/150.

Next steps

- Add a CI job to run `npm run smoke:api-me` after the server is available in integration tests, or add a JS-based test that can run in CI with the test runner and better assertions.
- Add an end-to-end test that starts the app in a test environment and asserts the UI banner appears when the `tasks` scope is missing.
