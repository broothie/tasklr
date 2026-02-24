# 001: Initial Implementation

## What Was Done

Scaffolded the full Tasklr application from scratch. The app is a minimal Node.js + Express web server that uses the Google Tasks API as its data persistence layer.

### Tech Stack

- **Node.js + Express** — lightweight web server
- **express-session** — server-side session management for OAuth tokens
- **googleapis** — Google Tasks API + Google OAuth2 integration
- **dotenv** — local environment variable loading
- **Vanilla HTML/CSS/JS** — no frontend framework, minimal dependencies

### Files Created

- `package.json` — dependencies and scripts
- `.gitignore` — ignores node_modules and .env
- `.env.example` — documents required environment variables
- `server.js` — main application server with all routes
- `views/login.html` — Google sign-in landing page
- `views/index.html` — main task management UI

### Features Implemented

- **Google OAuth2 authentication** — users sign in with Google; tokens stored in server-side session
- **Task list sidebar** — displays all Google Task lists belonging to the user
- **Task CRUD**:
  - View all tasks in a selected list (pending first, completed below)
  - Create tasks with title, optional notes, optional due date
  - Toggle completion status (click circle checkbox)
  - Edit task title, notes, due date via modal
  - Delete tasks with confirmation prompt
- **Overdue detection** — due dates in the past shown in red
- **Keyboard shortcuts** — Escape closes modals/forms, Enter submits add form

### Environment Variables Required

Set these as GitHub repository secrets (mapped in the workflow):

- `GOOGLE_CLIENT_ID` — from Google Cloud Console OAuth2 credentials
- `GOOGLE_CLIENT_SECRET` — from Google Cloud Console OAuth2 credentials
- `SESSION_SECRET` — any long random string
- `BASE_URL` — the deployed URL (e.g., https://tasklr.example.com)
- `PORT` — (optional) defaults to 3000

### Verified

- `npm install` completes with 0 vulnerabilities
- `node --check server.js` passes (no syntax errors)
- Server starts and logs `Tasklr running at http://localhost:3000`

## What Comes Next

1. **Deployment config** — the app needs to be deployed somewhere accessible; needs Procfile or Dockerfile if deploying to a PaaS
2. **Google OAuth redirect URI** — the Google Cloud Console OAuth2 credentials need the deployed URL registered as an authorized redirect URI (action required by @broothie)
3. **GitHub Secrets** — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `BASE_URL` must be set (action required by @broothie)
4. **Token refresh** — currently doesn't handle expired access tokens gracefully; needs refresh token logic
5. **Error handling** — more robust API error handling (quota limits, revoked access, etc.)
6. **Task list creation** — currently only shows existing lists; could add ability to create new lists
