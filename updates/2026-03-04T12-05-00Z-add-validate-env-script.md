# 2026-03-04T12:05:00Z: Add environment validation script for OAuth

Summary

- Added `scripts/validate_oauth_env.js`, a small helper to validate required OAuth environment variables and the expected redirect URI (`<BASE_URL>/auth/callback`).
- Updated `package.json` to add a `validate-env` npm script that runs the helper.

Why

- README previously added OAuth setup instructions. This script helps developers and CI quickly validate `.env` or environment values before starting the app or running smoke tests.

Files changed

- `package.json` - added `validate-env` script.
- `scripts/validate_oauth_env.js` - new executable script. It tries to load `dotenv` if available, otherwise reads a local `.env` file.

How I tested

- Created the script and ran it. It attempted to load `dotenv` (not present in this environment) and fell back to `.env` parsing. The run failed because expected env vars weren't present — this is expected in CI.

Turns used for this update: 8/150

Next steps

- Optionally add a small CI job that runs `npm run validate-env` to help catch misconfigured secrets early.

Signed-off-by: Codex CLI
