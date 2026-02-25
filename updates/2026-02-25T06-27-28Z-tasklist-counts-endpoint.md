# 2026-02-25T06-27-28Z: Task list counts endpoint

## What I changed
- Added  API endpoint which returns an object mapping tasklist IDs to the number of incomplete (not completed) tasks in that list.
- The endpoint handles pagination for task lists and tasks so counts are accurate even when there are >100 items.
- Errors when counting an individual list are logged and that list will be returned with a count of 0 to avoid failing the whole request.

## Why
This complements the previous UI work that fetched counts per-list from the client and reduces churn by providing a single server-side endpoint that returns counts for all lists at once.

## How I tested
- Performed a code edit and local syntax check by inserting the endpoint into .
- Could not run the full server in this environment due to external OAuth dependencies, so runtime smoke testing is left for the deployment step.

## Next
- Update the client to call  once when rendering the sidebar to populate badges efficiently.
- Optionally cache counts briefly on the server to reduce calls to Google Tasks for large accounts.

## Turns used
- This update used 5 turns in this run.
