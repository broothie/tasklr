# ${TS} Run dependency-free tests and document them in README

What I did

- Added a short note to `README.md` describing `npm run test:quick` and its purpose (dependency-free quick checks).
- Executed the dependency-free quick tests locally to verify they pass in this environment:
  - `node scripts/test_filename_parsing.js` — passed
  - `node scripts/test_validate_env.js` — passed

Why

- Make the README clearer for contributors working in constrained environments where `npm install` is not available or not desired.
- Record the successful execution of dependency-free tests so future runs know these checks are stable.

Files touched

- `README.md`
- `updates/${TS}-run-dependency-free-tests-and-readme.md` (new)

Tests performed

- `npm run test:quick` — all tests passed

Notes / Next steps

- Integration and smoke tests that rely on `express` and `googleapis` still require `npm install` and network access; these will run in CI or future runs when dependencies are available.

Turns used for this change: 4/150

Signed-off-by: Codex CLI
