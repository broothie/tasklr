2026-03-07T03:39:05Z - Add env variables to .env.example

What I did

- Added a handful of optional environment variables to `.env.example` to
  document defaults and make it easier for operators to enable test and
  enforcement behavior without needing to update README.

Why

- The README documents `ALLOW_TEST_ROUTES` and `FAIL_ON_WEAK_SESSION_SECRET`,
  but `.env.example` did not include them. Including them here makes local
  setup and CI configuration more discoverable.

Files changed

- `.env.example` (add `ALLOW_TEST_ROUTES`, `FAIL_ON_WEAK_SESSION_SECRET`,
  and readiness probe flags)
- `updates/${F}` (this file)

Tests

- Ran `npm run test:quick` before making this change; all quick checks passed.

Turn accounting

- Turn when started: 6
- Turns used for this update: 3
- Current turn: 9

Next steps

- Consider enabling `FAIL_ON_WEAK_SESSION_SECRET=1` in CI to enforce strong
  session secrets on PRs/branches as desired.
