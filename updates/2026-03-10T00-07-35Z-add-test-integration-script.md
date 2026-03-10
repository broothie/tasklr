# 2026-03-10 Add `test:integration` npm script

What I changed

- Added `test:integration` to `package.json` which runs `node scripts/test_integration_routes.js`.

Why

- The repo contains a lightweight integration smoke test script (`scripts/test_integration_routes.js`) that starts the app with `ALLOW_TEST_ROUTES=1` and verifies `/__test/export` and `/__test/me`.
- That script already performs a safe skip when runtime dependencies (notably `express`) are missing, so adding an npm script makes it easy to run the integration check in environments with dependencies installed (local dev, CI with `npm install`, etc.).

Tests performed

- Ran `node scripts/test_integration_routes.js` in this environment. Output: `SKIP: runtime dependencies missing (express).` — expected here because runtime deps are not installed in this runner.

Next steps

- Run `npm run test:integration` in environments where `npm install` has been executed to validate the integration routes.
- Consider wiring this script into CI jobs that install dependencies and should exercise the app routes.

Turns used for this update: 4/150
Cumulative assistant turns used so far (approx): 10/150

Signed-off-by: Codex CLI
