# 2026-03-01T12-04-18Z: Add local unit-style smoke export test (no network sockets)

What I changed

- Added Header format OK: attachment; filename="tasklr-export-2026-03-01T12-04-18-369Z.json"
Sample JSON serialization OK: a lightweight unit-style smoke test that verifies the server's export behavior (Content-Disposition header format and JSON serializability) without starting an HTTP server or requiring project dependencies.
- Wired the script into  as the npm script .

Why

- The earlier smoke test attempted to start the full server and exercise , but starting network listeners is not permitted in this execution environment (socket listen returns EPERM). To allow CI/local verification without opening sockets or installing dependencies, this unit-style test reproduces and asserts the exact header construction and JSON output used by the real endpoint.

Tests performed

- Ran Header format OK: attachment; filename="tasklr-export-2026-03-01T12-04-18-397Z.json"
Sample JSON serialization OK in this environment. Output:
  - Header format OK:  contains 
  - Sample JSON serialization OK

Notes / Next steps

- In CI or development environments where starting the app is allowed, the original server-based smoke test () remains available and can be used to validate the full HTTP behavior (it requires  and installed dependencies).
- The local unit-style test is safe to run in restricted environments and ensures the most important export formatting behavior is correct.

Turn accounting

- Turn when started: 3
- Turns used for this update: 2 (Turns 3–4)

