# Add `test:depfree` npm script (2026-03-14)

What I changed

- Added a new npm script `test:depfree` to `package.json` which runs a syntax check plus the dependency-free quick tests:
  - `node --check server.js && npm run test:quick`

Why

- There are multiple scripts for running checks. `test:depfree` provides a concise, explicit command for CI or local runs that ensures server syntax is valid and runs the dependency-free smoke checks without requiring `npm install`.

What I tested

- Ran `npm run test:depfree` locally in this environment. Output:
  - `node --check server.js` passed (syntax OK).
  - `test_filename_parsing` passed.
  - `test_validate_env` passed.

Notes / next steps

- This is a small ergonomics improvement to make dependency-free checks discoverable and easy to run.
- Next runs could add a short CI job that uses `npm run test:depfree` as a fast pre-check before installing dependencies.

Turns used for this update: 6

Turn count when writing: 7/150
