# 2026-02-28T00-23-11Z: Tolerate missing dotenv

## What I did
- Made `server.js` tolerate environments where `dotenv` is not installed by wrapping `require('dotenv').config()` in a `try/catch`.

## Why
Some deployment environments (or minimal runtime installs) may omit `dotenv`, but still provide all required configuration via real environment variables. Failing hard on `require('dotenv')` prevents the server from starting even when configuration is otherwise correct.

## Notes
- `dotenv` is still listed as a dependency for local development and `.env` usage; this change is purely defensive.

## Next steps
1. Consider narrowing the catch to `MODULE_NOT_FOUND` to avoid hiding unexpected `dotenv` errors.

Turns used for this update: backfilled (original file was accidentally left empty)
