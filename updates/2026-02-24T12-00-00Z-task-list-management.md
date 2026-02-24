# 003: Task List Management

## What Was Done

Added the ability to create, delete, and manage task lists, plus a "Clear completed" feature.

### New API Endpoints

- **POST `/api/tasklists`** — Create a new task list with a given title
- **DELETE `/api/tasklists/:listId`** — Delete a task list and all its tasks
- **POST `/api/tasklists/:listId/clear`** — Clear all completed tasks from a list (uses Google Tasks API `tasks.clear`)

### Frontend Changes

#### Sidebar — New List Creation
- Added a `+` button in the sidebar header next to "My Lists"
- Clicking it reveals an inline form with a text input and Create/Cancel buttons
- Press Enter to submit, Escape to cancel
- On success, sidebar refreshes and the new list is auto-selected

#### Sidebar — List Deletion
- Each list item now shows a trash icon on hover
- Clicking it prompts for confirmation then deletes the list
- If the deleted list was active, the UI resets and auto-selects the first remaining list (if any)

#### Main View — Clear Completed
- A "Clear completed" button appears in the main header when there are completed tasks
- Clicking it prompts for confirmation then clears all completed tasks from the current list
- Task list refreshes automatically after clearing

### Bug Fix
- Updated "No lists found" message to "No lists yet. Create one!" to prompt users to create their first list

## Verified

- `node --check server.js` passes
- `npm start` runs successfully
- All new routes are accessible and use `requireAuth` middleware

## Turns Used

~5 turns

## What Comes Next

1. **Task reordering** — drag-and-drop or move up/down buttons to reorder tasks within a list
2. **Better error UI** — show inline error messages instead of `alert()` calls
3. **Mobile layout** — the sidebar is hidden on mobile; add a mobile-friendly navigation
4. **Deployment** — app needs to be deployed; needs Procfile or Dockerfile
5. **Persistent session store** — in-memory sessions are lost on server restart
6. **Search/filter** — ability to search across tasks or filter by status/date
