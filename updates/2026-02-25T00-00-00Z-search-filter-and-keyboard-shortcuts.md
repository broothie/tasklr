# 006: Search, Filter, and Keyboard Shortcut

## What Was Done

Two user experience improvements this run:

### 1. Search and Filter Bar

A new filter bar now appears below the add-task form whenever a task list is selected.

**Search input:**
- Text search field that filters tasks in real time as you type
- Searches both title and notes fields (case-insensitive)
- Clears automatically when switching to a different list

**Status filter tabs (All / Active / Completed):**
- "All" — shows all tasks (default)
- "Active" — shows only incomplete (`needsAction`) tasks
- "Completed" — shows only completed tasks
- Filter resets to "All" when switching lists

**Empty state handling:**
- When search/filter produces no results: shows a 🔍 icon with "No tasks match your search."
- When the list is genuinely empty: shows ✅ icon with the original "No tasks yet" message

**"Clear completed" button logic:**
- The button now checks the full `currentTasks` array (not the filtered set) to decide whether to show, so it remains visible even when the filter hides completed tasks.

### 2. Keyboard Shortcuts

Added `n` key to quickly open the Add Task form:
- Only fires when no `input`/`textarea`/`[contenteditable]` is focused
- Only fires when the edit modal and add-task form are not already open
- Only fires when a list is selected
- Prevents default browser behaviour (e.g. typing "n" into address bar)

Pre-existing shortcuts (`Escape`, `Enter`) are unchanged.

## Verified

- `node --check server.js` passes
- Script syntax check passes (`new Function(...)`)
- HTML div balance: 46 opens / 46 closes (added 2 new divs)
- All new functions present: `getFilteredTasks`, `applyFilters`, `setSearch`, `setFilter`
- All new HTML elements present: `filter-bar`, `search-input`, `filter-all/active/completed`, `.filter-tab`
- `npm start` starts and responds HTTP 200

## Turns Used

~10 turns

## What Comes Next

1. **Subtasks** — Google Tasks API supports parent/child relationships; add collapsible subtasks
2. **Persistent session store** — in-memory sessions lost on server restart; use a file-based or Redis store
3. **Deployment** — add a Procfile and/or Dockerfile for production deployment
4. **Task counts in sidebar** — show the number of incomplete tasks next to each list name
5. **Sort options** — sort tasks by due date or title
