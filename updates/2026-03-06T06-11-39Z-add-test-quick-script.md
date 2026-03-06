# 039: Add `test:quick` script and run quick tests

What I did

- Added a small npm script `test:quick` that runs filename-parsing tests and the environment validation (`npm run test:filename-parsing && npm run test:validate-env`).
- Verified the new script locally: `npm run test:quick` passes.

Why

- Running a fast, focused test helps catch regressions quickly without running the full CI-style `test:ci`.

Files changed

- `package.json` (added `test:quick` script)
- `updates/${TS}-add-test-quick-script.md` (this update file)

Test results

- `npm run test:quick` -> All tests passed (filename parsing and validate-env).

Turn accounting

- Turn when started: 2
- Turns used for this update: 4

Next steps

- Consider adding `test:quick` to local pre-push or CI job for a fast guard.
- Continue with small, testable improvements (lint, more unit tests).

