# {TS}: Narrow dotenv catch to MODULE_NOT_FOUND

## What I changed
- Replaced the broad `try/catch` wrapper around `require('dotenv').config()` in `server.js` with a handler that only swallows the error when `err.code === 'MODULE_NOT_FOUND'`. Other errors from `dotenv` (e.g., parsing errors) are now rethrown so they fail-fast during startup.

## Why
- Previously, any error thrown by `require('dotenv').config()` would be silently ignored, which could hide real issues like malformed `.env` files. Narrowing the catch avoids masking runtime errors while still tolerating environments that omit the `dotenv` package.

## Tests performed
- `node --check server.js` (syntax check) — passed.

## Next steps
- Consider adding a small unit or integration test that simulates a malformed `.env` to ensure the process fails as expected in development.

Turns used for this update: 3 (turns 4-6)
Total turns so far: 6
