# Add smoke-status-health npm script

What I did:

- Added a new npm script `smoke-status-health` to `package.json` that runs `scripts/smoke_status_health_checkdeps.js`.
- This wrapper script starts the server and probes `/api/status` and `/health`, but it will gracefully skip the test when dependencies aren't installed (useful in minimal CI or local dev without `npm install`).

Why:

- Having a named npm script makes it easy to run this smoke test from CI or locally: `npm run smoke-status-health`.

Notes / next steps:

- Run `npm install` locally then `npm run smoke-status-health` to exercise the full server-based smoke test.
- Consider adding the script to CI workflows where appropriate.

Turns used for this update: 4
