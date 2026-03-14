# Tasklr

Tasklr is a small web-based task manager that uses the Google Tasks API as its datastore.

Quick start

- Requires Node.js v20 or newer (see package.json engines)


- Copy `.env.example` to `.env` and set the required environment variables:
  - `GOOGLE_CLIENT_ID` - OAuth client ID
  - `GOOGLE_CLIENT_SECRET` - OAuth client secret
  - `SESSION_SECRET` - session secret for `express-session`
  - `BASE_URL` (optional) - base URL for the app (defaults to `http://localhost:3000`)

- Install dependencies:
  - `npm install` (network required)

- Run the app:
  - `npm start`
  - For development with automatic reload: `npm run dev`

Notes

- The app uses Google OAuth to connect to a user's Google Tasks account. See `server.js` for the OAuth flow.
- Sessions are stored on disk in the `sessions/` directory by default.
- The project intentionally uses the Google Tasks API as the single data store — there is no separate database.

Environment and `dotenv` behavior

- The code calls `require('dotenv').config()` at startup to load environment variables from a local `.env` file when available.
- The server tolerates the *absence* of the `dotenv` package (e.g., in production builds where environment variables are provided by the platform) and will continue to start if `dotenv` is not installed.
- However, errors thrown by `dotenv` during parsing (for example, a malformed `.env` file) are *not* silently ignored — they will be rethrown so the process fails fast during development. This helps catch configuration mistakes early.

- To validate the server's startup syntax without running the HTTP server you can run:
  - `node --check server.js`

Files of interest

- `server.js` - main Express server and API routes
- `views/` - frontend HTML/CSS/JS
- `package.json` - dependencies and scripts

Tests


Dependency-free tests (local)

- Use the fast dependency-free checks when `node_modules` may not be installed or network access is unavailable.
- Run the quick checks with:
  - `npm run test:quick` — runs `test_filename_parsing` and `test_validate_env` (no npm install required).
  - `npm run test:local` — runs a syntax-only check (`node --check server.js`) plus the dependency-free tests.
- These are useful for CI smoke runs or when iterating locally without installing the full dependency tree.
- The repository includes a focused unit-style check for filename parsing used when processing `Content-Disposition` headers, plus a small dependency-free check that verifies the client preserves URL fragments when building the re-authorize URL. Run the checks with:
  - `npm test` (runs the `test:filename-parsing` script and the re-authorize hash check `test_include_hash_in_reauth.js`)

- Quick dependency-free checks

- Fast local syntax-only check
  - Use `npm run test:local` to run `node --check server.js` plus the dependency-free tests (same as `npm run check:syntax && npm test`). This is convenient when `node_modules` may not be installed.

- `npm run test:quick` runs two fast checks (`test_filename_parsing` and `test_validate_env`) that do not require installing the full dependency tree. These are useful in constrained environments or local smoke runs where `node_modules` are not installed.

- There are additional smoke test scripts related to export/download behavior:
  - `npm run smoke-export` (requires network and appropriate credentials)
  - `npm run smoke-export-local` (local-only variant)

- Note: some tests and smoke scripts require environment variables (see the top of this README) and network access to Google APIs. Use the `--silent` or CI-friendly invocation when integrating into automated runs.

Contributing

This project is developed by an automated agent (Codex). Make small, incremental changes and add an entry to `updates/` for each run.

OAuth Setup

- Create OAuth credentials in Google Cloud Console:
  - Go to APIs & Services → Credentials → Create Credentials → OAuth client ID.
  - Application type: "Web application".
  - Add an authorized redirect URI equal to your `BASE_URL` plus `/auth/callback` (for local development set `http://localhost:3000/auth/callback` by default).
  - Note the generated `Client ID` and `Client secret` and set them in your `.env` (see `.env.example`).

- Required scopes used by this app:
  - `https://www.googleapis.com/auth/tasks` (access to Google Tasks)
  - `https://www.googleapis.com/auth/userinfo.profile` (basic profile info used for the UI)

- OAuth behavior notes:
  - The server uses `access_type=offline` and `prompt=consent` when generating the auth URL so a refresh token can be returned and stored in the session for longer-lived access.
  - The OAuth callback path is `/auth/callback`. Ensure your OAuth client configuration lists this exact path on the Google side (including scheme and host) or the OAuth flow will fail.

Local environment variables (see `.env.example`)

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — set from the credentials you created in the Cloud Console.
- `SESSION_SECRET` — a long random string used to sign session cookies. Change this in production.
- `BASE_URL` — the external URL where the app is reachable (defaults to `http://localhost:3000`). This value is used to build the OAuth redirect URI.
- `ALLOW_TEST_ROUTES` — set to `1` to enable lightweight test-only routes (used by local smoke tests).
- `FAIL_ON_WEAK_SESSION_SECRET` — set to `1` or `true` to make `scripts/validate_oauth_env.js` exit non-zero when `SESSION_SECRET` is shorter than 16 characters (useful for CI enforcement).
- `READINESS_CHECK_GOOGLE` and `READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN` — control the authenticated readiness probe; see `server.js` for details.

Testing and smoke checks

- A CI-friendly script exists to run the fast checks locally: `npm run test:ci`.
- For export/download behavior you can use `npm run smoke-export-local` which exercises the local export endpoint without hitting Google.

If you need help getting OAuth credentials set up, consult Google's documentation: "Create OAuth client ID" under APIs & Services in the Google Cloud Console.

Validate environment helper

- A small developer helper exists: `npm run validate-env` which runs `scripts/validate_oauth_env.js`.
- The helper checks that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `BASE_URL` are set and verifies the expected OAuth redirect URI (`<BASE_URL>/auth/callback`).
- Use this before running smoke tests or starting the app locally to catch common misconfiguration early.

Generate a secure session secret

- You can generate a suitable `SESSION_SECRET` with: `npm run gen-secret` (defaults to 32 bytes = 64 hex chars).
- For example: `SESSION_SECRET=$(npm run --silent gen-secret)` and then export it before starting the server.

Smoke status/health smoke test

- A quick server smoke test is available: `npm run smoke-status-health`.
- This runs `scripts/smoke_status_health_checkdeps.js`, which will automatically skip and print a helpful message if runtime dependencies (like `express`) are not installed. Run `npm install` to enable the full server-based smoke test.
- In CI, consider running `npm run smoke-status-health` in jobs that install dependencies; it starts the app with test routes enabled and checks `/api/status` and `/health`.

Quick commands (dependency-free)

- Run the minimal, dependency-free checks locally (no `npm install` required):
  - `npm run test:quick` — runs filename-parsing and env-validation checks.
  - `npm run test:local` — runs a fast syntax-only check (`node --check server.js`) then the dependency-free checks.
- Expected outcome: these scripts exit `0` when checks pass and print a short summary; they are safe to run in CI or developer machines without network access.


Running dependency-free tests (local, no npm install)

- These checks are safe to run without installing dependencies or having network access.
- Quick commands:
  - `npm run test:quick` — runs filename-parsing and env-validation checks (no network / no node_modules required).
  - `npm run test:local` — runs `node --check server.js` plus the dependency-free checks.
- Use these when you want a fast syntax-and-smoke check in CI or on a developer machine without network access.
