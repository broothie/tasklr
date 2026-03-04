# Tasklr

Tasklr is a small web-based task manager that uses the Google Tasks API as its datastore.

Quick start

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

- The repository includes a focused unit-style check for filename parsing used when processing `Content-Disposition` headers. Run the check with:
  - `npm test` (runs the `test:filename-parsing` script)

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
- `READINESS_CHECK_GOOGLE` and `READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN` — control the authenticated readiness probe; see `server.js` for details.

Testing and smoke checks

- A CI-friendly script exists to run the fast checks locally: `npm run test:ci`.
- For export/download behavior you can use `npm run smoke-export-local` which exercises the local export endpoint without hitting Google.

If you need help getting OAuth credentials set up, consult Google's documentation: "Create OAuth client ID" under APIs & Services in the Google Cloud Console.
