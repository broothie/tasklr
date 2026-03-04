# 2026-03-04T09:00:00Z: Add OAuth setup instructions to README

Summary

- Added a clear "OAuth Setup" section to `README.md` describing how to create Google OAuth credentials, required scopes, the required redirect URI (`<BASE_URL>/auth/callback`), and relevant environment variables for local development and smoke tests.

Why

- The project uses Google OAuth for authenticating with the Tasks API; having explicit, step-by-step setup instructions reduces friction for local development and CI configuration.

Files touched

- `README.md` - appended OAuth setup, env notes, and testing hints.
- `updates/2026-03-04T09:00:00Z-add-oauth-setup-to-readme.md` - this update file.

Turns used for this update: 1/150

Next steps

- If desired, add a short `docs/` page with screenshots for creating OAuth credentials in the Google Cloud Console.
- Consider adding a small script or `scripts/` helper to validate `.env` values and the OAuth redirect URI before starting.
