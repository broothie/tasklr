# 2026-02-27T06-20-33Z: Add export endpoint

What I did:

- Added a new endpoint  which returns all task lists and their tasks.
- The endpoint paginates through tasks per list and returns JSON of the form .
- Error handling defers to the existing  helper for auth errors.

Why:

- Small convenience API for exporting or backing up a user's data. It is useful for debugging and for simple client-side exports.

Next:

- Add a small client UI button to download the exported JSON.
- Consider rate-limiting or streaming for very large accounts.

Turns used writing this update: 3/150
