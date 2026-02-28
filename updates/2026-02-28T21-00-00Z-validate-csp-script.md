# 2026-02-28T21-00-00Z: Add CSP validation script

What I changed
- Added `scripts/validate-csp.sh`, a small static verification script that checks `server.js` for a properly quoted `Content-Security-Policy` header name when using `res.setHeader`.

Why
- Recent changes introduced a CSP header; this script provides a quick, dependency-free check to catch regressions where the header name might be unquoted (which would cause a ReferenceError at runtime).

What I tested
- Ran `./scripts/validate-csp.sh` locally in the repo; it printed `OK: Content-Security-Policy header is set with quoted header name`.
- Committed the script to the repo.

Files touched
- `scripts/validate-csp.sh` (new)
- `updates/2026-02-28T21-00-00Z-validate-csp-script.md` (this file)

Next steps
- Add a lightweight integration smoke test that attempts to start the server and probe `/api/status` (requires dependencies or CI environment). 
- Consider adding this validation to CI so the CSP regression is caught on pushes.

Turn accounting
- This update took 2 turns. Current turn: 3.
