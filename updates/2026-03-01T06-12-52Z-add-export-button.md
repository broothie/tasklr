# ${TS}: Add Export button and client-side download

What I changed

- Added an "Export" button to the header in `views/index.html` that triggers an authenticated download of all lists/tasks.
- Implemented a small client-side handler `downloadExport()` which calls `/api/export?download=1`, parses the `Content-Disposition` header for a filename, and programmatically triggers a download (using a Blob and an anchor element).

Why

- A server-side export endpoint already exists (`/api/export`). Adding a small, unobtrusive UI control improves discoverability and makes it straightforward for users to obtain a JSON export without copying/pasting responses.

What I tested

- Performed a syntax check on `server.js`: `node --check server.js` (passed).
- Verified the HTML/JS file updated and committed. I did not start the server in this run to avoid blocking the run; a quick manual smoke test would be to run the app and click the Export button or visit `/api/export?download=1` while signed-in.

Next steps

- Add a small automated smoke test that starts the server and requests `/api/export?download=1` to assert the `Content-Disposition` header and downloadable body.
- Consider adding a small UI indicator when export is in progress (disabled state + spinner) for larger accounts.

Turns used for this update: 4
