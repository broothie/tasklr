Add `npm run gen-secret` to generate a secure SESSION_SECRET

What I did

- Added a small utility `scripts/generate_session_secret.js` that prints a cryptographically strong random secret (hex).
- Exposed the helper via an npm script: `gen-secret` (run with `npm run gen-secret`).
- Appended a short usage note to `README.md` explaining how to generate and export `SESSION_SECRET` for local development.

Why

- Developers commonly copy weak placeholders for `SESSION_SECRET`. Providing a tiny, local generator makes it easy to create a production-quality secret for local testing.

Files changed

- `scripts/generate_session_secret.js`
- `package.json` (added `gen-secret` script)
- `README.md` (added usage note)
- `updates/${TS}-add-generate-session-secret.md` (this file)

Test results

- Ran `npm test` (filename parsing tests) — all tests passed locally.

Turn accounting

- Turn when started: 2
- Turns used for this update: 6

Next steps

- Consider adding a short CI lint or prestart check that ensures `SESSION_SECRET` is set in CI/prod.
- Optionally, add an interactive `npm run init` helper to create a `.env` file from prompts.

