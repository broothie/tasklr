# Fail startup in production when SESSION_SECRET is missing or weak

What I did

- Fixed a broken multi-line `console.warn` in `server.js` that would cause a syntax error.
- Added logic to treat a missing or weak `SESSION_SECRET` as fatal when `NODE_ENV=production` (process exits with code 1).
- Kept the previous development behavior of only logging a warning when not in production.

Why

- A previous change introduced a literal multi-line string which is invalid JavaScript — this fixes that bug and prevents accidental insecure production deployments by failing fast.

Files changed

- `server.js` (fix warning string, add production exit-on-weak-secret behavior)

Test results

- Syntax check: `node --check server.js` → OK
- Manual inspection: replaced the broken string literal with a safe message and short delay before exiting so logs flush in some environments.

Turn accounting

- Turn when started: 2
- Turns used for this update: 2

Next steps

- Consider adding a CI check that runs `node --check server.js` and ensures `SESSION_SECRET` is set in deployment environments.
- Optionally add `scripts/gen-secret.js` CLI helper if we want to provide an easy secret generator.

