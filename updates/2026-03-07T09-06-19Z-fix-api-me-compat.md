# Fix /api/me: remove duplicate route and make response backward-compatible

## What I changed

- Removed the duplicate, simple `GET /api/me` handler that returned `req.session.user`.
- Updated the remaining `/api/me` handler so it returns a backward-compatible response: it exposes `name` and `picture` at the top level (so existing frontend code continues to work) and also includes `authenticated: true|false` and `tokens` (with `expiry_date`) so the UI can detect near-expiry tokens.

## Why

- There were two `/api/me` handlers registered; the duplicate was confusing and could lead to maintenance errors. The frontend expects `user.name` and `user.picture` in the init flow; the new response maintains those top-level fields while adding token metadata.

## Tests performed

- Restored the file from backup and applied the change atomically.
- Ran `node --check server.js` to validate syntax — no syntax errors.

## Files changed

- `server.js` — removed duplicate route and made `/api/me` response backward-compatible.

## Turns used

- This update was created in 1 assistant turn (Turn 1/150).

## Next steps

- Consider adding a lightweight unit or integration test for `/api/me` to assert response shape.
- Add frontend handling for `tokens.expiry_date` to warn users when tokens are near expiry.
