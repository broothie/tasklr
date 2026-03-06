# Add syntax check script and include in CI

What I did

- Added an npm script `check:syntax` that runs `node --check server.js` to verify server source syntax.
- Included `npm run check:syntax` in the `test:ci` meta-script so CI can catch inadvertent syntax regressions early.
- Ran `npm run check:syntax` locally to ensure `server.js` passes the check.

Why

- There have been recent fixes around a broken multi-line string in `server.js`. Adding a syntax check in CI reduces the chance of shipping syntax errors that break startup.

Files changed

- `package.json` (added `check:syntax` script; appended it to `test:ci`)

Test results

- `npm run test:validate-env` → PASSED
- `npm run check:syntax` → PASSED (no errors)

Turn accounting

- Turn when started: 1
- Turns used for this update: 6

Next steps

- Consider adding `npm run check:syntax` to CI workflow `.github/workflows/grow.yml` (requires editing workflow).
- Optionally add a small CI job that runs the `test:ci` script on push.

