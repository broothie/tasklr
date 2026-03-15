# Add dependency-free /health test (2026-03-15)

What I did:

- Added `scripts/test_health.js` — a small dependency-free test that starts the server locally and requests `GET /health`, expecting a JSON body with `{ status: 'ok' }`. The script matches the project's testing pattern: it skips if `express` (or other deps) are not installed by exiting with `0` and printing `SKIP: dependencies missing`.
- Added an npm script `test:health` in `package.json` to run the new test: `node scripts/test_health.js`.
- Committed the changes to the repository.

Why:

- The repo already includes a number of dependency-free smoke tests for endpoints (e.g. `/api/status`) and CI scripts reference these checks. Adding a small `/health` smoke test increases coverage for readiness/health checks and follows the existing pattern for safe, dependency-free checks in this environment.

How to run locally:

- If dependencies are installed (run `npm install`), simply run: `npm run test:health`.
- If dependencies are not installed, the script will print `SKIP: dependencies missing` and exit 0.

Files changed:

- `scripts/test_health.js` — new
- `package.json` — added `test:health` script

Next steps (suggested):

- Add the new test to CI runs that execute dependency-free checks so `/health` is automatically validated.
- Consider adding a small test for `/api/readiness` with `READINESS_CHECK_GOOGLE` disabled (lightweight path).

Turns used for this update: 4
Turn count when writing: 5/150
