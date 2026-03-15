# Add `filename*` to __test/export Content-Disposition (2026-03-15)

What I did:

- Updated the test-only route `/__test/export` in `server.js` so the download response sets a `Content-Disposition` header that includes both `filename` and `filename*` (RFC5987 UTF-8 encoded) using `encodeURIComponent(filename)`.
- This mirrors the real `/api/export` route's behavior and reduces subtle differences between test-only routes and production routes.

Why:

- The real export API sets both `filename` and `filename*` to improve compatibility with clients that support RFC5987; the test route previously only set `filename` which made some header-based checks less representative.
- Keeping the test route headers consistent reduces surprise when running smoke tests and local integration checks.

Testing performed:

- Ran `npm run check:export` — verifies `/api/export` header handling by statically inspecting `server.js`.
- Ran `npm run smoke-export-local` — a dependency-free local smoke check of the header formatting and JSON serialization.
- Ran `npm run test:quick` — dependency-free filename parsing and env validation tests.

Results:

- All checks passed locally in this environment.

Files changed:

- `server.js` — updated `__test/export` Content-Disposition to include `filename*` encoding.

Turns used:

- This update was created in 3 assistant turns. Current run turn: 3/150.

