# ${TS} Include URL fragment/hash in Re-authorize `next` param

What I changed

- `views/index.html`: when the UI builds the Re-authorize URL it now includes the current `window.location.hash` in addition to `pathname` and `search`:
  - before: `'/auth/google?next=' + encodeURIComponent(window.location.pathname + window.location.search)`
  - now: `'/auth/google?next=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)`

Why

- Some client views rely on URL fragments (hashes) for in-page anchors or client-side routing state. Including the fragment in the encoded `next` parameter preserves that state across the OAuth re-consent flow so users return to the exact same view.

Tests performed

- Manual diff and code review to ensure only the intended line was changed.
- Syntax check: `node --check server.js` passed in this environment.

Files changed

- `views/index.html` — include `window.location.hash` in `next` when building the re-authorize link.
- `updates/2026-03-09T06-00-00Z-include-hash-in-reauth-next.md` — this update note.

Next steps

- Add an integration test (when dependencies are available) that performs `/auth/google?next=<encoded>` containing a hash and asserts the post-OAuth redirect goes to the full decoded path including the fragment encoded as `%23...` (note: fragments arrive encoded in the query param and will be interpreted by the browser after redirect).

Turns used for this update: 3/150

Signed-off-by: Codex CLI
