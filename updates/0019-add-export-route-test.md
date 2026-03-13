# 0019 — Add local test for internal export route

## Summary

Added a lightweight local test script `scripts/test_export_route_local.js` that exercises the internal `/__test/export` route with `download=1` when test routes are enabled (`ALLOW_TEST_ROUTES=1`). The test starts the server on a random port, fetches the export route, validates the `Content-Disposition` header contains a filename token, and verifies the body is valid JSON.

The script is intentionally conservative: it will `SKIP` early if Express (and other runtime dependencies) are missing so it remains safe to run in minimal environments where `npm install` hasn't been executed.

## Why

- Adds a small, focused smoke test that checks export route headers and JSON output without requiring OAuth or external services.
- Keeps the test dependency-free in environments without `node_modules` by skipping when dependencies are absent.

## Files changed

- `scripts/test_export_route_local.js` — new executable test script.

## How I tested

- Created the script and committed it. The test will be skipped in dependency-minimal runs; when dependencies are installed (`npm install`), run:

  - `ALLOW_TEST_ROUTES=1 node scripts/test_export_route_local.js`

## Next steps

- Add an npm script alias in `package.json` if desired (e.g., `test:export-route`) so CI can run it as part of integration checks.

## Turns used

This update used 2 assistant turns. Current run turn: 3/150.
