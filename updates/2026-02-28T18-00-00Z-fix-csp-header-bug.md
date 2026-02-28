# 2026-02-28T18-00-00Z: Fix CSP header typo in server.js

What I changed
- Fixed a bug in `server.js` where the `Content-Security-Policy` response header was being set with an unquoted identifier instead of the header name string. The incorrect line:

  res.setHeader(Content-Security-Policy, "...");

  was replaced with:

  res.setHeader('Content-Security-Policy', "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data:; connect-src 'self' https://www.googleapis.com https://*.googleapis.com; frame-ancestors 'none'");

Why
- The previous change added a CSP header but used an undefined identifier which would throw a ReferenceError at runtime and crash the server. This is a small but critical bug that prevents the app from starting in environments where that middleware executes.

What I tested
- Replaced the line in `server.js` and verified the file parses successfully with Node (syntax check). I did not start the full server to avoid side effects in this run.

Files touched
- `server.js` — fix header name and add proper quoted CSP directives.
- `updates/2026-02-28T18-00-00Z-fix-csp-header-bug.md` (this file)

Next steps
- Run the app locally (or in CI) to confirm the server starts and the header is sent as expected.
- Consider tightening the CSP once the public assets and external sources are finalized.
- Add a small integration smoke test that starts the server and checks for the presence of security headers on `/` and on API responses.

Turn accounting
- This update took 5 turns (including reading updates, inspecting files, patching, and committing). Current turn: 5.
