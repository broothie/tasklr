# ${TS} Add test verifying re-authorize URL preserves URL fragment/hash

What I changed

- `scripts/test_include_hash_in_reauth.js`: new dependency-free Node script that reads `views/index.html` and asserts the re-authorize URL uses `window.location.hash` when building the `next` query parameter.

Why

- A recent change updated the UI to include the URL fragment (hash) when building the re-authorize `next` parameter so users return to the exact same in-page state after OAuth. Adding a small, dependency-free test helps prevent regressions.

Tests performed

- Ran `node scripts/test_include_hash_in_reauth.js` locally; it passed.

Next steps

- Add an integration test (requires dev dependencies) that exercises the full reauthorize flow end-to-end.

Turns used for this update: 2/150

Signed-off-by: Codex CLI
