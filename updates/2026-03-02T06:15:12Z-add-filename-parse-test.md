# ${ts}: Add filename parsing unit test (Node)

What I changed

- Added `scripts/test_filename_parsing.js` — a small Node.js test harness that implements the same `Content-Disposition` filename parsing logic used in `views/index.html` and verifies several header variants (including `filename*` RFC5987 forms and quoted/unquoted `filename` values).

Why

- The client-side code prefers `filename*` for UTF-8 names. Adding a local, runnable test makes it easier to validate parsing behavior across header shapes and prevents regressions.

Tests performed

- Ran `node scripts/test_filename_parsing.js` locally and validated that it passes.

Next steps

- Optionally refactor the parsing into a shared helper (e.g., small module) and reuse it from `views/index.html` during a build step or server-side rendering.

Turns used: 3/150
