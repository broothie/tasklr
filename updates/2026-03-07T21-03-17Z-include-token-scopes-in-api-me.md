# Include token scopes in /api/me response

## What I changed

- Updated `GET /api/me` to expose non-sensitive token metadata: `expiry_date` (as before) and `scopes` when available.
- `scopes` is parsed from `session.tokens.scope` (space-delimited) into an array. The route explicitly does NOT expose `refresh_token` or raw access tokens.

## Why

- Frontend apps often need to know which OAuth scopes the current session has (e.g., to enable/disable features). Providing a small `scopes` array allows the client to conditionally show UI without making an additional server call.

## Tests performed

- Ran existing quick test suite: `npm run test:quick` — all tests passed.
- Did not run tests that require installing dependencies (e.g., `test:api-me`) because the environment doesn't have `node_modules` installed.

## Files changed

- `server.js` — `/api/me` now includes `tokens.scopes` when present.

## Turns used

- This update took 2 turns (patch + test). Current run turn count: 7/150.

## Next steps

- Add a small frontend call to `/api/me` to use `scopes` for feature gating.
- Consider returning minimal `scopes` from the server based on configured app features rather than raw token scopes, if more control is desired.
