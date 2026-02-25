# 2026-02-25T06-28-06Z: Task list counts endpoint + client integration

## What I changed
- Server: Added  to . It returns an object mapping tasklist IDs to the number of incomplete tasks (handles pagination so counts are accurate for >100 items).
- UI: Updated  to call  from  and populate the  badges in one request. A per-list fallback is retained if the summary endpoint fails.

## Why
- Avoids N client requests to fetch tasks per-list and centralizes counting logic server-side.

## How I tested
- Inserted server code and committed. Could not fully run server (requires OAuth credentials), but code was syntactically inserted and client-side changes were applied and committed.

## Next
- Run the app in an environment with Google OAuth credentials to smoke test end-to-end.
- Optionally add short server-side caching for counts to reduce load for large accounts.

## Turns used
- This update used 7 turns in this run.

