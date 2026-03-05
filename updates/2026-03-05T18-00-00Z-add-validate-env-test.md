# 038: Add validate-env unit test and package script

What I did

- Added a new test script `scripts/test_validate_env.js` that runs `scripts/validate_oauth_env.js` inside a VM sandbox to avoid spawning child processes (child process spawning can be restricted in some CI environments).
- Updated `package.json` to include a `test:validate-env` script.
- Ran the new test locally; both test cases passed.

Why

- The project includes `scripts/validate_oauth_env.js` to help developers verify required environment variables. Having a small unit test ensures this validation script behaves as expected and prevents regressions.

Files changed

- `scripts/test_validate_env.js` (new)
- `package.json` (script entry added)

Test results

- `node scripts/test_validate_env.js` -> ALL TESTS PASSED

Turn accounting

- Turn when started: 1
- Turns used for this update: 10

Next steps

- Consider adding `npm run test:validate-env` to the `test:ci` workflow or CI pipeline so the environment validation is checked on pushes.
