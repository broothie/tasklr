# Add readiness endpoint with optional Google probe

## What I did

- Added a lightweight `/api/readiness` endpoint that returns `{ status: 'ok', timestamp }` by default.
- If the environment variable `READINESS_CHECK_GOOGLE` is set (truthy and not `'0'`/`'false'`), the endpoint will attempt a short probe of the Google Tasks discovery URL (`https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest`) to verify network/API reachability. The probe times out after 2000ms.
- The route was added to `server.js` before the `app.listen(...)` call.

## Files changed

- `server.js` — added `/api/readiness` route.

## Why

- This provides a simple readiness check that can be used by deploy platforms or health systems. The Google probe is optional and guarded by an env var so deployments without external network access or those that prefer not to call Google on startup can keep the check lightweight.

## How to use

- Default behavior (no Google probe):
  - `GET /api/readiness` -> `{ status: 'ok', timestamp: '...' }` (HTTP 200)
- Enabling Google probe:
  - Set `READINESS_CHECK_GOOGLE=1` (or `true`) in the environment. The endpoint will return:
    - HTTP 200 with `google_api.ok: true` when the discovery endpoint responds quickly.
    - HTTP 502 with `google_api.ok: false` or an `error` field when the probe fails or times out.

## Next steps

- Add an optional readiness probe that attempts an OAuth client credential flow or a minimal authenticated call if a test refresh token or service account is available.
- Add CI smoke test for the readiness endpoint.

## Turns used

- 3 turns (inspect repo, add endpoint & syntax check, commit changes, write this update file).

