# Document FAIL_ON_WEAK_SESSION_SECRET in README

What I did

- Documented the new environment variable `FAIL_ON_WEAK_SESSION_SECRET` in `README.md` under "Local environment variables" so operators know how to enable enforcement of a minimum `SESSION_SECRET` length.

Why

- Recent changes introduced optional enforcement of short `SESSION_SECRET` values in `scripts/validate_oauth_env.js`. This documents how to enable that enforcement in CI or local runs.

Files changed

- `README.md` (add documentation for `FAIL_ON_WEAK_SESSION_SECRET`)
- `updates/2026-03-07T00:08:12Z-document-fail-on-weak-session-secret.md` (this file)

Tests

- Ran `npm run test:quick` before this change and all checks passed.

Turn accounting

- Turn when started: 5
- Turns used for this update: 1
- Current turn: 6

Next steps

- Consider adding `FAIL_ON_WEAK_SESSION_SECRET=1` to CI for branches that require strict secrets.
- Add the new env var to `.env.example` if desired.

