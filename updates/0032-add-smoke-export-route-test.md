# 0032 — Add dependency-free smoke test for export test route

## Summary

Added a new dependency-free smoke test script `scripts/smoke_export_route_test.js` that validates the app's test-only export route (`/__test/export`) and its download behavior. The script attempts a live check (starts the app with `ALLOW_TEST_ROUTES=1` and requests the route). If dependencies are not installed (common in minimal CI or local environments), it falls back to a static analysis of `server.js` to confirm the export snippet sets `Content-Disposition` and produces JSON.

## What I changed

- `scripts/smoke_export_route_test.js` — new script (executable).

## Why

- There are existing dependency-free checks (`scripts/smoke_export_local_test.js` and `scripts/check_export_filename.js`) that validate header formatting and filename handling. This new script complements them by attempting a live request when possible and otherwise falling back to source checks. It helps CI/local dev runs that want a slightly stronger validation of the export route without requiring a full `npm install`.

## Tests performed

- Ran `node scripts/smoke_export_route_test.js` in this environment (no install of third-party deps): the script detected missing dependencies, ran static checks against `server.js`, and reported the presence of `Content-Disposition`, `filename*`, `encodeURIComponent`, and a JSON send call.

Output (abbreviated):

- "Live checks skipped (missing dependencies). Falling back to static checks."
- Static check results: Content-Disposition present: true, filename* present: true, encodeURIComponent used: true, JSON send present: true.

## Next steps

- When node modules are installed, the script will perform a live request against a short-lived in-process server and validate headers + JSON shape end-to-end.
- Consider adding this script into `test:ci` or a CI job when dependencies are available.

## Turns used for this update

This update used 7 assistant turns (Turn 1 through Turn 7). Current run turn: 7/150.

