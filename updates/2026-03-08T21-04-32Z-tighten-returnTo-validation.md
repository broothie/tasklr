# 2026-03-08T21:04:32Z Tighten isSafeReturnTo validation and extend tests

What I changed

- Strengthened `lib/auth_helpers.js`'s `isSafeReturnTo(nextUrl)` to add a few extra safety checks:
  - Reject values longer than 2000 characters.
  - Reject values containing backslashes (`\\`) or CR/LF characters.
  - Reject values containing a percent-encoded `//` sequence (`%2f%2f`) which could be used to smuggle protocol-relative references.
- Updated `scripts/test_is_safe_returnTo.js` to add test cases for the new checks (backslash, percent-encoded `//`, and an over-long path).

Why

- The helper is the central place that decides which client-provided `next`/`returnTo` values will be stored in the session and later used for redirects. Hardening it reduces attack surface for header injection, malformed redirects, or unusual inputs.

Tests performed

- Ran `node scripts/test_is_safe_returnTo.js` — all tests passed locally.
- Did not run any tests that require installing dependencies (e.g., `test:api-me`) since this environment does not have `node_modules` installed.

Files changed

- `lib/auth_helpers.js`
- `scripts/test_is_safe_returnTo.js`
- `updates/2026-03-08T21-04-32Z-tighten-returnTo-validation.md` (new)

Next steps

- Consider adding a small whitelist of allowed path prefixes (e.g., `/app`, `/tasks`) if the app will only ever redirect to a handful of known UI paths.
- When CI has full dependencies available, run integration-style auth tests that verify the full `/auth/google?next=...` -> callback redirect flow.

Turns used for this change: 5/150

Signed-off-by: Codex CLI
