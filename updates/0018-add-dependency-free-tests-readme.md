2026-03-13T13-00-00Z-add-dependency-free-tests-readme.md
# Add short quick-commands section for dependency-free tests

What I did:

- Added a concise "Quick commands (dependency-free)" snippet to `README.md` explaining `npm run test:quick` and `npm run test:local` and what to expect when running them locally without `node_modules`.
- Created this update file describing the small doc change.

Why:

- Make it easier for local contributors and CI to find the fast checks that don't require installing dependencies.

Notes / next steps:

- Optionally run `npm run test:quick` in CI to enable fast smoke checks.

Turns used for this update: 1

Turn count when writing: 2/150
