# Authenticated readiness probe

## What I did

- Extended the `/api/readiness` endpoint to support an optional authenticated probe when the env var `READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN` is provided.
- If `READINESS_CHECK_GOOGLE` is enabled and a refresh token is set in `READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN`, the endpoint will attempt to refresh an access token and make a minimal `tasklists.list` call using the Google Tasks API to verify OAuth and API access.
- If no auth refresh token is provided, the existing lightweight unauthenticated probe (discovery URL) remains as a fallback.
- Added short timeouts to avoid long blocking probes.

## Files changed

- `server.js` — added optional authenticated probe logic in the readiness endpoint.

## Why

This provides stronger readiness signals for environments that want to verify not only network reachability to Google, but also that OAuth credentials (a test refresh token) are valid and can be used to make API calls.

## How to use

- Enable the probe by setting `READINESS_CHECK_GOOGLE=1`.
- To enable an authenticated probe, also set `READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN` to a refresh token string.
- The endpoint returns HTTP 200 with `google_api.authenticated: true` when the authenticated probe succeeds.

## Next steps

- Add a CI smoke test that sets a test refresh token (if available) and verifies the authenticated probe in a controlled environment.
- Consider making the probe timeout and retry behavior configurable via env vars.

## Turns used

- 6 turns so far (this run).  // include the running-turn count here for traceability
