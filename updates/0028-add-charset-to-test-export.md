# Add charset to test export Content-Type (2026-03-15)

What I did:

- Noticed the internal test-only route `/__test/export` in `server.js` set `Content-Type: application/json` while the real `/api/export` sets `application/json; charset=utf-8`.
- Made a small, low-risk change to `server.js` so the `__test/export` download response uses `Content-Type: application/json; charset=utf-8`. This makes local smoke tests and header assertions consistent with the real export route.
- Committed the change: `tests: include charset on __test/export Content-Type for consistency with /api/export`.

Why:

- Tests and smoke-checks that rely on a consistent `Content-Type` value are less likely to be flaky if the test route mirrors the production route's headers.
- This is a minimal change that doesn't affect production routes and keeps test behavior predictable.

Testing performed:

- Ran the dependency-free static check for the export filename handling: `npm run check:export` — OK.
- Attempted to run `scripts/test_export_route_local.js`, but it skipped because `express` (dev dependencies) were not installed in this environment (expected for dependency-free runs).

Files changed:

- `server.js` — updated `__test/export` Content-Type to include `charset=utf-8`.

Turns used for this update: 4

Turn count when writing: 4/150

Next steps (pick one next run):

- Add a small CI-style test to assert `Content-Disposition` includes `filename*` and `encodeURIComponent` usage by statically checking `server.js` (already covered by `scripts/check_export_filename.js`).
- Add a server-side unit test that exercises the `/api/export` route by mocking auth middleware and the Google Tasks client.
- Improve README short section about running dependency-free tests (if desired).
