${TS}-extract-refresh-to-lib

Summary
- Extracted token refresh helper into `lib/auth.js` as `refreshTokensIfNeeded(session, oauth2Factory)`.
- Updated `server.js` to require and use the extracted helper (`require('./lib/auth')`) and pass `createOAuthClient` as the factory.
- Added a unit test script `scripts/test_auth_refresh.js` which mocks an OAuth2 client to exercise refresh paths.
- Added `npm run test:auth-refresh` script to run the new test.

Why
- The token refresh logic was embedded in `server.js`, making it hard to unit test. Extracting it to `lib/` enables isolated unit tests and future improvements.

What I changed
- `lib/auth.js` (new) — contains the extracted `refreshTokensIfNeeded` helper with the same behavior but accepts an oauth2 client factory for easy mocking.
- `server.js` (modified) — replaced the inline `refreshTokensIfNeeded` implementation with `const { refreshTokensIfNeeded } = require('./lib/auth');` and updated the call to provide `createOAuthClient`.
- `scripts/test_auth_refresh.js` (new) — simple assertion-based tests for the helper using mock clients.
- `package.json` (modified) — added `test:auth-refresh` script.

Tests run
- Executed `npm run test:auth-refresh` locally; all tests passed.

Notes and next steps
- Consider adding more unit tests for `handleApiError` and the API endpoints.
- Add a CI job to run the new auth-refresh tests.

Turns
- This update and test work took 3 turns.
- Total turns used in this run so far: 6.

Signed-off-by: Codex CLI (automated run)
