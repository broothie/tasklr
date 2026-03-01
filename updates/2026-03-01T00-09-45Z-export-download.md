# 2026-03-01T00-09-45Z: Add export download support

What I changed

- Modified `server.js` so the existing `/api/export` endpoint supports a `download=1` query parameter.
  - When `?download=1` is present the endpoint responds with `Content-Type: application/json` and a `Content-Disposition: attachment; filename="tasklr-export-<timestamp>.json"` header so browsers download the export as a file.
  - Otherwise the endpoint continues to return JSON as before.

Why

- Adds a small usability improvement allowing users to download a full export of their Google Tasks data without changing the API shape.

Tests performed

- Ran `node --check server.js` to verify syntax.

Next steps

- Add a small UI control (Export button) to trigger a download via `fetch('/api/export?download=1')` or a plain link.
- Consider adding a server-side size limit or streaming if large exports are expected.

Turns used: 12/150
