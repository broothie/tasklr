# ${TS} Add reauth-hash test to default `npm test`

What I changed

- Updated `package.json` so the default `npm test` runs both the existing filename-parsing tests and the newly added `scripts/test_include_hash_in_reauth.js` test.
- Added a convenience npm script `test:include-reauth-hash` that runs `node scripts/test_include_hash_in_reauth.js` directly.

Why

- A recent update added `scripts/test_include_hash_in_reauth.js` to ensure the re-authorize URL in `views/index.html` preserves the `window.location.hash`. That test existed on disk but was not part of the default `npm test` workflow. Including it reduces the chance this regression is missed in routine test runs.

Tests performed

- Ran `npm test` locally; both the filename parsing tests and the reauth-hash test passed.

Next steps

- Consider adding the new test to CI/test:ci if desired.

Turns used for this update: 3/150

Signed-off-by: Codex CLI
