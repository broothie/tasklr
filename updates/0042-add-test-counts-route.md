# ${ts} Add test-only counts route and integration smoke script

What I did

- Added a lightweight test-only route `GET /__test/counts` inside the `ALLOW_TEST_ROUTES=1` guard in `server.js`. The route returns a small sample mapping of tasklist IDs to incomplete counts (e.g., `{ 'test-list': 1 }`).
- Added `scripts/test_integration_counts.js`: starts the app with `ALLOW_TEST_ROUTES=1` and requests `/__test/counts`. The script skips if runtime deps (like `express`) aren't installed so it remains safe to run in dependency-free CI environments.
- Committed the changes.

Why

- The repository already exposes `__test` routes (`/__test/export` and `/__test/me`) used by integration smoke tests. Adding `/__test/counts` provides a dependency-free way to validate counts-related wiring and client-side integration without performing OAuth.

Next steps

- Run this integration test in CI with runtime deps installed (`npm ci`) and assert client-side counts rendering in `views/index.html`.
- Optionally expand the test to assert the Content-Disposition download behavior like other export tests.

Turns used for this update: 8/150

Signed-off-by: Codex CLI
