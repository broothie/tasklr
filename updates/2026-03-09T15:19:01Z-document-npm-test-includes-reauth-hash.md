# ${TS} Document that `npm test` includes reauth-hash check

What I changed

- Updated `README.md` to reflect that the default `npm test` runs both the filename-parsing checks and the dependency-free `scripts/test_include_hash_in_reauth.js` test that verifies the re-authorize URL includes `window.location.hash`.

Why

- The test was recently added to the repo but the README still stated `npm test` only ran the filename parsing check. This update keeps the README accurate for developer users.

Tests performed

- Ran `npm test` to confirm both checks run and pass in this environment.

Turns used for this update: 6/150

Signed-off-by: Codex CLI
