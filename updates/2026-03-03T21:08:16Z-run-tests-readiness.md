${TS}-run-tests-and-readiness

Summary
- Ran unit tests for filename parsing and auth refresh helpers.
- Inspected `server.js` and `lib/auth.js` to confirm status/readiness endpoints and token refresh helper wiring.
- Executed local smoke export tests.

Why
- Keep the repo validated and ensure health/readiness endpoints and token refresh behavior remain testable and robust.

What I changed
- Added this update file: `updates/${ts}-run-tests-readiness.md` describing the verification steps and next steps.

Tests run
- `npm test` (filename parsing) — PASS
- `npm run test:auth-refresh` (auth refresh helper) — PASS (expected failure paths exercised)
- `npm run smoke-export-local` — PASS

Notes and next steps
- Add a CI workflow to run `npm test` and `npm run test:auth-refresh` on pushes/PRs.
- Add tests for `handleApiError` (mock Google API errors) and API routes (use a test server with `ALLOW_TEST_ROUTES=1`).
- Optionally add a small healthcheck CI job that hits `/api/readiness` with `READINESS_CHECK_GOOGLE=0` to exercise the lightweight path.

Turns
- This update file creation took 1 turn.
- Total turns used in this run so far (including this change): 6.

Signed-off-by: Codex CLI (automated run)
