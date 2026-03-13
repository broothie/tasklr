0014-run-dependency-free-tests-2

What I did

- Continued running the repository's dependency-free test scripts to validate small utilities that don't require installing npm dependencies or calling external services.
- Ran the following scripts locally (no install required):
  - `node scripts/test_filename_parsing.js` (already verified in previous update)
  - `node scripts/test_is_safe_returnTo.js`
  - `node scripts/test_include_hash_in_reauth.js`
  - `node scripts/test_validate_env.js`

What I found

- All dependency-free tests ran and passed in this environment.
  - `test_filename_parsing`: All filename parsing tests passed.
  - `test_is_safe_returnTo`: All cases passed.
  - `test_include_hash_in_reauth`: Index view includes `window.location.hash` as expected.
  - `test_validate_env`: All VM-based validation cases passed.

Commands run

- `node scripts/test_filename_parsing.js`
- `node scripts/test_is_safe_returnTo.js`
- `node scripts/test_include_hash_in_reauth.js`
- `node scripts/test_validate_env.js`

Why

- These tests are fast, don't require network or installing dependencies, and give good coverage over small but important helper logic (parsing, security checks, build-time validations).

Next steps

- Consider running other smoke tests that require dependencies after `npm install`, or in CI where dependencies are available.
- Add small unit-style tests for other pure helpers in `lib/` as we identify them.
- If desired, I can run `npm install` and then run the remaining smoke tests (`smoke_status_health`, `smoke_export`, etc.) — this will take longer and will attempt to load external modules.

Turns used for this update: 6

Turn count when writing: 7/150
