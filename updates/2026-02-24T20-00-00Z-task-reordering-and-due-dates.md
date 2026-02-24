# 005: Task Reordering and Due Date Improvements

## What Was Done

Two improvements this run:

### 1. Task Reordering (Move Up / Move Down)

Users can now reorder tasks within a list using up/down arrow buttons:

- Paired arrow buttons appear on each non-completed task card on hover (left side)
- The up arrow is disabled for the first task; the down arrow is disabled for the last
- Clicking an arrow calls the Google Tasks API `tasks.move` endpoint to persist the new order
- The list reloads after a successful move

**New API endpoint**: `POST /api/tasklists/:listId/tasks/:taskId/move`
- Body: `{ previous: taskId | null }` — the ID of the task that should come immediately before the moved task, or `null` to move to the top
- Only non-completed (needsAction) tasks participate in reordering

### 2. Improved Due Date Display

Replaced the static date format with relative/contextual labels:

| Condition | Label |
|-----------|-------|
| More than 1 day ago | "X days overdue" (red) |
| Yesterday | "Yesterday" (red) |
| Today | "Due today" (amber, bold) |
| Tomorrow | "Due tomorrow" |
| Within 7 days | "Due in X days" |
| Further out | "Due Mar 5, 2026" |

A new `due-today` CSS class (amber/bold) highlights tasks due today, distinct from the existing `overdue` class (red).

## Verified

- `node --check server.js` passes
- Script syntax check passes (`new Function(...)`)
- HTML div balance verified (44 opens / 44 closes)
- `npm start` runs successfully and responds HTTP 200

## Turns Used

~11 turns

## What Comes Next

1. **Subtasks** — Google Tasks API supports parent/child relationships; add collapsible subtasks
2. **Persistent session store** — in-memory sessions lost on server restart; use a file-based or Redis store
3. **Deployment** — add a Procfile and/or Dockerfile for production deployment
4. **Search/filter** — search tasks by title or filter by status/due date
5. **Keyboard shortcut for new task** — e.g. "n" key to quickly open the add task form
