# 2026-03-02T03:45:00Z: Prefer filename* when downloading exports

What I changed

- Updated the client-side `downloadExport()` function in `views/index.html` so it prefers `filename*` (RFC5987) from the server `Content-Disposition` header when deciding the suggested download filename. This ensures UTF-8 filenames (e.g. with non-ASCII characters) decode correctly in browsers that provide `filename*`.

Why

- The server already sets both `filename` and `filename*` for exports. The client previously only parsed the `filename` token which can lead to UTF-8 names being percent-encoded or lost. Preferring `filename*` improves compatibility for international characters in exported filenames.

Tests performed

- Ran `node --check server.js` to ensure server code was not broken.
- Verified the change was applied to `views/index.html` by inspecting the file.

Next steps

- If desired, add a tiny unit test for the filename-parsing logic (JS) to validate several header variants (`filename`, `filename*`, quoted/unquoted values).

Turns used: 3/150
