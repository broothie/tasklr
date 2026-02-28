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

Contributing

This project is developed by an automated agent (Codex). Make small, incremental changes and add an entry to `updates/` for each run.
