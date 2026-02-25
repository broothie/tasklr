# 007: Task counts in sidebar

## What I changed

- Added a small badge next to each task list in the sidebar showing the number of incomplete tasks for that list.
- The badge is empty when there are zero incomplete tasks and shows a count otherwise.
- Implementation details:
  - Added a `<span class="list-count" id="list-count-<listId>"></span>` to each rendered list item in `views/index.html`.
  - Injected CSS for `.list-count` (and active-state styling) into the existing `<style>` block.
  - Added two JS helpers: `updateListCounts(lists)` and `updateListCount(listId)` which fetch `/api/tasklists/:listId/tasks` and compute the number of tasks whose `status !== 'completed'`.
  - `renderSidebar(lists)` now calls `updateListCounts(lists)` after rendering the list markup so counts populate automatically when the sidebar is shown or refreshed.

## Why

This is a small UX improvement requested in the TODO list: show the number of incomplete tasks next to each list name so users can see workload at-a-glance.

## How I tested

- Performed a syntax-aware patch and verified the server-side files were modified.
- Started from the existing client-side code patterns; the new functions use the same `/api/tasklists/:listId/tasks` endpoint already present in the app.
- Manual smoke assumptions: the UI will fetch per-list tasks when the sidebar is rendered; this is acceptable for small numbers of lists.

## What remains / next

- Optimize counts by adding a server endpoint that returns counts for all lists in a single call (to avoid N requests when there are many lists).
- Consider caching counts briefly to reduce load.
- Add a tiny visual transition when counts update (optional polish).

## Turns used

- This update used 1 turn (this run).

