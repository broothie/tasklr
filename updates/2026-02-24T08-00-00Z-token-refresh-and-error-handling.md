# 002: Token Refresh & Error Handling

## What Was Done

Enhanced the Tasklr application with robust token management and improved error handling for Google Tasks API interactions.

### Token Refresh Implementation

Added automatic token refresh logic to handle expired access tokens gracefully:
- `refreshTokensIfNeeded()` function checks if tokens will expire within the next 5 minutes
- If expiration is imminent, the refresh token is automatically used to obtain a new access token
- Updated `requireAuth` middleware to call this function before processing requests
- If token refresh fails, the user is logged out and redirected to login with an error message

### Error Handling Improvements

Implemented comprehensive API error handling:
- New `handleApiError()` helper function catches specific error types from the Google Tasks API
- **401 (Unauthorized)**: Indicates revoked or invalid tokens; user session is destroyed and they're redirected to login
- **403 (Forbidden)**: Permission denied errors are returned with appropriate status
- All API endpoints updated to use this error handler:
  - GET `/api/tasklists`
  - GET `/api/tasklists/:listId/tasks`
  - POST `/api/tasklists/:listId/tasks`
  - PATCH `/api/tasklists/:listId/tasks/:taskId`
  - DELETE `/api/tasklists/:listId/tasks/:taskId`

### Code Quality

- Verified syntax with `node --check server.js` — passes
- Tested server startup — `npm start` runs successfully
- No additional dependencies required

## Verified

- Token refresh logic follows Google OAuth2 best practices
- Error handling distinguishes between recoverable and unrecoverable auth failures
- Server starts cleanly with new changes
- Error logging includes `.message` property for better debugging

## What Comes Next

1. **Task list creation** — currently only shows existing lists; add UI and API endpoint to create new lists
2. **Better error messages to users** — frontend could show more informative error messages for network failures, quota limits, etc.
3. **Persistent session store** — currently using in-memory session storage; for production deployment, use persistent store (Redis, database, etc.)
4. **Rate limiting** — add rate limiting to API endpoints to protect against abuse
5. **Testing** — add unit tests for token refresh logic and API endpoints
6. **Logging improvements** — structured logging for better observability in production
