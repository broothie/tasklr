# Document dependency-free tests in README

What I changed:

- Added a concise "Running dependency-free tests" section to `README.md` describing `npm run test:quick` and `npm run test:local`, and clarifying that these checks do not require `npm install` or network access.

Why:

- Make it easier for contributors and CI to run fast, dependency-free checks locally.
- This complements existing scripts such as `scripts/test_filename_parsing.js` and `scripts/validate_oauth_env.js` which are intentionally dependency-free.

Tests / verification:

- Ran `npm run test:quick` locally — these scripts are dependency-free and should exit 0 when passing.

Turns used for this update: 1

Turn count when writing: 3/150

