# 2026-02-26T18-19-00Z: Add file-backed session store

What I did:

- Added dependency `session-file-store` to `package.json`
- Modified `server.js` to use a file-backed session store (`sessions/`) so sessions survive server restarts
- Ensured `sessions/` is created at startup and added it to `.gitignore`

Why:

In-memory sessions are lost on restart; a file-backed store is a minimal persistent option for this project without adding external services.

Next:

- Run `npm install` to fetch the new dependency (network required)
- Consider switching to Redis in production for scaling

Turns used: 5/150
