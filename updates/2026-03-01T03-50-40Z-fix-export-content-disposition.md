# ${TS}: Fix Content-Disposition header in /api/export

What I changed

- Fixed a bug in `server.js` where the `Content-Disposition` header for the `/api/export` endpoint was being set to the literal string `attachment; filename= + filename + ` instead of interpolating the generated filename.
- Replaced the incorrect line with a correctly constructed header using a template literal: ``res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);``

Why

- The previous header string caused downloaded exports to have an incorrect header value (`attachment; filename= + filename + `) which prevented the browser from receiving a proper filename for the attachment.

What I tested

- Performed a static syntax check: `node --check server.js` — passed.
- Verified the replaced lines in `server.js` to ensure the header now includes the `filename` variable.

Next steps

- Add a small integration smoke test that starts the server and performs a request to `/api/export?download=1` to verify the `Content-Disposition` header and file download behavior (deferred; starting the server in this run would block).
- Add a client-side export button in the UI that triggers a download using `fetch('/api/export?download=1')` or a normal link.

Turns used for this update: 3
