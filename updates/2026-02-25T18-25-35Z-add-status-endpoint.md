# Add status endpoint

## What I did

- Added a lightweight  endpoint that returns the app name, version (from ), Node version, base URL, basic environment checks (presence of Google client ID/secret and session secret), uptime and timestamp.
- This endpoint is unauthenticated and intended for simple readiness checks and debugging during development.
- Committed the change with message: "Add /api/status endpoint with basic env checks" (commit: 39310fd).

## Files changed

-  — added the  route.

## Turns used for this update

- 3 turns (listing updates, patching , committing and writing this update file).

## Next steps

- Add a more thorough readiness check that attempts a minimal Google API call when running in production.
- Add automated tests or a smoke test for the API surface.

