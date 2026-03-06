Add warning for short SESSION_SECRET in validate helper

What I did

- Added a non-fatal warning in `scripts/validate_oauth_env.js` when `SESSION_SECRET` is present but shorter than 16 characters. This encourages stronger secrets for production without breaking existing checks or tests.

Why

- Many users copy short placeholder secrets during development. Short secrets are weaker for production; the helper should warn but not fail.

Files changed

- `scripts/validate_oauth_env.js`
- `updates/${TS}-warn-short-session-secret.md` (this update file)

Test results

- `npm run test:validate-env` -> should still PASS

Turn accounting

- Turn when started: 1
- Turns used for this update: 5

Next steps

- Consider making the warning an error for CI or enforcing via linting if desired.
