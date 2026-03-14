# 0024 Add dependency-free export filename presence check

What I did

- Added a small dependency-free Node script `scripts/check_export_filename.js` that reads `server.js` and verifies the `/api/export` route sets a `Content-Disposition` header and includes UTF-8 filename support (either a `filename*` parameter or use of `encodeURIComponent`).
- Added an npm script `check:export` to `package.json` so maintainers can run `npm run check:export` locally without installing dependencies.
- Ran the new script in this environment to verify it passes.

Why

- Some smoke tests rely on the export route to provide a downloadable JSON with a proper filename header; catching accidental regressions in the header code with a dependency-free check is useful for minimal CI environments.

How I ran the check

- `node scripts/check_export_filename.js` — the script inspects `server.js` and exits non-zero if the header or encoding support is missing.

Results

- The script reported the Content-Disposition header is present and that `filename*` and `encodeURIComponent` are used. Exit code 0.

Next steps

- Consider adding `npm run check:export` to an early CI job that doesn't require `npm install` to catch regressions quickly.
- Optionally extend the script to validate the test-only route `__test/export` as well.

Files changed

- `scripts/check_export_filename.js` — new script (executable)
- `package.json` — added npm script `check:export`

Turns used for this update

- This update was created across 3 assistant turns. Current run turn: 6/150.
