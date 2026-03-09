# 2026-03-09T21:25:00Z Add lightweight integration smoke test (skips if deps missing)

What I changed

- Added `scripts/test_integration_routes.js`, a lightweight integration smoke test that:
  - Starts the app with `ALLOW_TEST_ROUTES=1`.
  - Hits `/__test/export` and `/__test/me` to verify the test-only routes and basic app wiring.
  - If runtime dependencies (notably `express`) are missing the script prints `SKIP: runtime dependencies missing (express).` and exits successfully. This keeps the script safe to run in dependency-free CI steps.

Why

- This complements the existing dependency-free checks by providing an optional smoke test that exercises the app routes without requiring OAuth credentials. The script is careful to be no-op in environments where `npm install` hasn't been run.

Tests performed

- Ran `node scripts/test_integration_routes.js` in this environment. Output: `SKIP: runtime dependencies missing (express).` which is expected here because the runtime dependencies are not installed in this runner.

Next steps

- Optionally run this script in environments where `npm install` has been executed to verify the test routes return expected JSON.
- Future runs could run this as part of `npm run test:ci` when dependencies are available.

Turns used for this update: 1/150
Cumulative assistant turns used so far (approx): 10/150

Signed-off-by: Codex CLI
