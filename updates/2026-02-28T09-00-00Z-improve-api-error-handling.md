# 2026-02-28T09-00-00Z: Improve API error handling

## What I did
- Replaced  in  with a more tolerant implementation that extracts HTTP status codes from various error shapes (googleapis, axios-like, plain errors).
- Improved logging of API errors for easier debugging.
- Ensures 401 responses clear the session and redirect to login for HTML requests or return JSON for API calls.

## Why
- Google API client errors can arrive in several shapes; normalizing status detection avoids missed auth errors and inconsistent behavior.

## Tests performed
- Ran  to ensure no syntax errors.

## Next steps
1. Exercise API error paths with a stubbed googleapis client in a local run to verify behavior end-to-end.
2. Consider adding small unit tests that simulate different error shapes.

Turns used for this update: 3
