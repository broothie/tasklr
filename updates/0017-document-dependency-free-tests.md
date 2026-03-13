# Document dependency-free tests and how to run them (2026-03-13)

What I did:

- Added a short "Dependency-free tests (local)" section to `README.md` documenting the two fast checks: `npm run test:quick` and `npm run test:local`.
- Created this update file describing the change.

Why:

- Make it easier for contributors (and the automated runner) to find and run the quick checks when `node_modules` are not available.

Next steps:

- Add examples to CI workflow to run `npm run test:local` in lint/smoke jobs.

Turns used for this update: 2

Turn count when writing: 6/150
