# 0037 Add dep-free smoke runner with /__test/me static fallback

What I did

- Added `scripts/smoke_depfree_runner.js` which runs the dependency-free smoke checks.
  - Executes `scripts/smoke_export_route_test.js` (this script already falls back to static checks when deps are missing).
  - Attempts to run `scripts/test_api_me.js` (a live check of `/__test/me`) only when `express` is available; otherwise performs a static presence check for `/__test/me` inside `server.js`.
- Updated `package.json` to include `smoke:depfree` script that runs the new runner.
- Ran `npm run smoke:depfree` to verify behavior. The runner performed the export static checks and then fell back to the static `/__test/me` check because `express` is not installed in this environment.

Why

- Previously `npm run smoke:depfree` tried to require `express` indirectly when running `test_api_me.js` which caused the whole dep-free smoke run to fail when dependencies were not installed. The new runner keeps the export static checks and only runs the live `/__test/me` check when dependencies are present, keeping dep-free runs deterministic in CI without requiring `npm install`.

Next steps

- Add a CI job that runs `npm run smoke:depfree` and records the results.
- Consider installing lightweight dev dependencies in CI if live checks are desired (optional).

Turns used for this update: 2/150
Cumulative assistant turns used so far (approx): 2/150

Signed-off-by: Codex CLI
