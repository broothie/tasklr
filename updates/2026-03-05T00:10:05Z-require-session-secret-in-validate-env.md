# 2026-03-05T00:10:05Z: Require SESSION_SECRET in validate-env helper

Summary

- Added  to the required variables checked by .
- Added a lightweight check that  looks like a full URL (warns if scheme missing).
- Improved the example  guidance to include .

Why

- The server relies on  for signing session cookies. Validating it early reduces configuration errors in development and CI.

Files changed

-  - now requires  and adds small warnings.
-  - this update file.

How I tested

- Did not run the full server (dependencies not installed in this environment). The changes are limited to the local validation helper and are safe to run with .

Turns used for this update: 11/150

Next steps

- Optionally wire 
> tasklr@1.0.0 validate-env
> node scripts/validate_oauth_env.js into CI or add a dedicated CI job to run it before smoke tests.

Signed-off-by: Codex CLI
