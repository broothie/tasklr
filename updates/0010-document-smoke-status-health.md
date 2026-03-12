# ${TS} Document smoke status/health script in README

What I did

- Added a short README note describing `npm run smoke-status-health` and how it behaves when dependencies are missing.
- Created this update file `updates/0010-document-smoke-status-health.md` to record the change.

Why

- Several recent updates added smoke scripts for `/api/status` and `/health` and a dependency-checking wrapper. A small README note helps contributors discover and run the smoke test locally and in CI.

How I tested

- Verified the README now contains a new "Smoke status/health smoke test" section.
- Did not run the server-based smoke script here (this environment may lack installed node modules). The smoke wrapper already skips cleanly if `express` is not installed.

Files changed

- `README.md` — short documentation added.
- `updates/0010-document-smoke-status-health.md` — this file.

Turns used

- This change was implemented in 3 assistant turns. Current run turn: 4/150.

Next steps

- Optionally enable `npm run smoke-status-health` in CI where dependencies are present.
- If desired, add a small GitHub Actions job that runs the smoke test in a runtime-enabled environment.

