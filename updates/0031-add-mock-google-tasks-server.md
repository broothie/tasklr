2026-03-15T00:00:00Z — Add dependency-free mock Google Tasks server

## Summary

Added a tiny, dependency-free mock Google Tasks server and a simple test script so future runs and CI can exercise basic Google Tasks flows without real Google credentials. This helps enable offline integration-style testing and reduces the need to run live Google API tests during early development.

## What I changed

- `scripts/mock_google_tasks_server.js` — an HTTP server (built with Node core `http`) that implements:
  - `GET /users/@me/lists` — returns a small list collection
  - `GET /lists/:listId/tasks` — returns tasks for a list
  - `POST /lists/:listId/tasks` — creates a new task
- `scripts/test_mock_server.js` — simple test that starts the mock server, calls the endpoints, and verifies responses.
- This update file `updates/0031-add-mock-google-tasks-server.md`

## Why

Previous updates recommended adding a mock server to allow CI and local runs to exercise integration routes without real Google credentials. This is a minimal starting point that is fully dependency-free and can be used by CI jobs or local scripts.

## Next steps

- Wire tests to use the mock server (e.g. start mock server before running `test_integration_routes.js` when a flag is set).
- Optionally add richer behavior to the mock (pagination, task fields, error simulations).
- Add a CI job that starts the mock server and runs integration checks.

## Turns used

This update used 2 turns.
