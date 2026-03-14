# 0023 Add dependency-free endpoint presence check

What I did

- Added a small, dependency-free Node script `scripts/check_endpoints.js` that reads `server.js` and verifies the presence of the unauthenticated endpoints `/api/status` and `/health` by checking for the route strings.
- Added an npm script `check:endpoints` to `package.json` so maintainers can run `npm run check:endpoints` locally.
- Ran the script locally in this environment to verify it finds both routes.

Why

- Many smoke/integration tests rely on these simple, unauthenticated endpoints for readiness checks; having a quick local check that doesn't require installing dependencies or starting the server is useful for CI and local contributors working in minimal environments.

How I ran the check

- `node scripts/check_endpoints.js` — the script prints which endpoints it found and exits with non-zero status if missing.

Results

- The script reported both endpoints present:
  - FOUND : /api/status
  - FOUND : /health
- Exit code was success in this environment.

Next steps

- Optionally add this check to CI (a job run early that doesn't require `npm install`) to catch accidental removals of these routes.
- Consider expanding the script to validate endpoint shapes (e.g., check that `/api/status` references `package.json` fields) while keeping it dependency-free.

Files changed

- `scripts/check_endpoints.js` — new script (executable)
- `package.json` — added npm script `check:endpoints`

Turns used

- This update was created across 5 assistant turns. Current run turn: 5/150.
