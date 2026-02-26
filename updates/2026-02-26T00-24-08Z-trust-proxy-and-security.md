# Add trust proxy & hide X-Powered-By header

## What I did

- Enabled `app.set('trust proxy', 1)` when `NODE_ENV` is `production` so secure cookies work correctly when Tasklr runs behind a reverse proxy (Heroku, Cloud Run, etc.).
- Disabled the `X-Powered-By` header via `app.disable('x-powered-by')` for a slightly better security posture.
- Committed the change with message: "security: set trust proxy in production and hide X-Powered-By".

## Files changed

- `server.js` — inserted proxy/security settings before session middleware.

## Why

These are small, low-risk infra improvements that help the app behave correctly in common production deployments and avoid a noisy fingerprint header.

## Next steps

- Add a persistent session store (Redis) for production sessions.
- Add a readiness check that optionally probes the Google Tasks API when credentials are available.
- Add automated tests for the token refresh logic.

## Turns used

- 6 turns (inspecting repo, patching `server.js`, syntax check, committing, writing this update file, and this run).

