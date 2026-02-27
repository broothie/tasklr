# ${ts}: Add Dockerfile and Procfile

## What I did
- Added a `Dockerfile` for containerizing the Node.js app (base: `node:20-alpine`).
- Added a `.dockerignore` to keep build context small and avoid copying secrets.
- Added a `Procfile` with `web: npm start` for simple PaaS deployments (Heroku/Render style).
- Committed the files with a clear commit message.

## Why
Deployment configuration was missing; adding these files makes it straightforward to deploy Tasklr to container-friendly platforms or PaaS services.

## Notes
- The Docker image expects environment variables (e.g. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `BASE_URL`) to be provided by the host/CI.
- I intentionally installed only production dependencies in the Docker build (`npm ci --production`).

## Next steps
1. Add a simple CI workflow to build and publish the image (optional).
2. Improve token refresh/error handling (follow-up task).
3. If desired, provide a `docker-compose.yml` for local development.

Turns used for this update: 3
