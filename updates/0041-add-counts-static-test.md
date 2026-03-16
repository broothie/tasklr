# ${ts} Add dependency-free static test for task-list counts

What I did

- Added `scripts/test_counts_endpoint_present.js`: a small, dependency-free static check that verifies `server.js` exposes `/api/tasklists/counts` and `views/index.html` contains references used by the client to render counts (e.g., `updateListCounts()` or `list-count-` IDs).
- Ran the new test locally; it passed.

Why

- Provides a quick guard that the counts feature is wired in both server and client without requiring Google API access.
- This makes future changes safer and gives CI a fast check for regressions related to the counts sidebar.

Next steps

- Add a lightweight integration smoke test that uses the mock Google Tasks server to exercise the counts endpoint end-to-end (this will require wiring the Tasks client to hit the mock server or adding a test-only route that proxies to the mock).
- After that, ensure counts update on task creation/clear flows and add tests that validate that behavior.

Turns used for this update: 3 (file + commit) — cumulative turns used: 6/150

Signed-off-by: Codex CLI
