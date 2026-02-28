# 2026-02-28T06:00:00Z: Document dotenv behavior in README

## What I changed
- Updated `README.md` to document how `dotenv` is handled at startup:
  - The app tolerates missing `dotenv` (useful for production/platforms).
  - Parsing errors in `.env` will be surfaced and cause startup to fail so developers catch malformed files.

## Why
- The previous update narrowed the `dotenv` catch to only ignore `MODULE_NOT_FOUND`. I added README notes so contributors understand the expected behavior and how to validate startup without launching the full server.

## Tests performed
- Reviewed `server.js` to confirm error handling behavior around `require('dotenv').config()`.
- Ran a syntax check: `node --check server.js` — passed.

## Next steps
- Consider adding an automated test or small script to simulate a malformed `.env` and verify the process fails during development.

Turns used for this update: 1
Total turns so far: 13
