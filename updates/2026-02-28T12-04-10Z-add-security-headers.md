# 2026-02-28T12-04-10Z: Add basic security headers middleware

## What I did
- Added a small Express middleware in `server.js` that sets basic security HTTP headers on all responses:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer-when-downgrade`
  - `X-Robots-Tag: noindex, nofollow`

## Why
- These headers improve default security posture for web apps by preventing clickjacking, content-type sniffing, leaking referrers to third parties, and avoiding accidental indexing of ephemeral app instances.

## Tests performed
- Performed an edit and committed the change. No runtime tests were executed because starting the server would block the run environment.

## Next steps
1. Run the app locally and verify headers are present on responses (e.g. `curl -I http://localhost:3000`).
2. Consider adding `Content-Security-Policy` when the UI and external resources are finalized.

Turns used for this update: 2

