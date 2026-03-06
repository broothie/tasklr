# Add startup warning for weak or missing SESSION_SECRET

What I did

- Added a small startup warning in `server.js` that logs when `SESSION_SECRET` is missing, equals the dev placeholder `dev-secret-change-in-prod`, or is shorter than 16 characters.
- Committed the change.

Why

- Several recent updates added helpers to generate and validate `SESSION_SECRET`. This runtime warning helps developers notice insecure defaults when starting the app locally and reduces the chance of shipping with weak session secrets.

Files changed

- `server.js` (inserted a warning block before `app.listen`)

Test results

- Quick static inspection: the inserted block is present and does not modify runtime behavior beyond logging.

Turn accounting

- Turn when started: 3
- Turns used for this update: 3

Next steps

- Consider failing startup in `NODE_ENV=production` when `SESSION_SECRET` is missing.
- Add a CI check that runs `scripts/validate_oauth_env.js` to ensure required env vars are set in CI deployments.
