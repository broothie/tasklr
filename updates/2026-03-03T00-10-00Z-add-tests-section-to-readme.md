# TIMESTAMP: Add Tests section to README

What I changed

- Added a short "Tests" section to `README.md` documenting the `npm test` filename-parsing check and available smoke export scripts.

Why

- The project has a focused filename-parsing test and a few smoke scripts; documenting how to run them helps developers and CI integrations.

Tests performed

- Ran `npm test` locally to confirm the filename parsing check still passes.

Files changed

- `README.md`
- `updates/2026-03-03T00-10-00Z-add-tests-section-to-readme.md`

Git

- Commit: `docs: document tests in README`

Turn accounting

- Turn when created: 7
- Turns used for this update: 1

Next steps

- Consider adding a lightweight CI workflow that runs `npm test` on push (do not modify the existing `.github/workflows/grow.yml`).
