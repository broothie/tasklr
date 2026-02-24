# 004: UX Improvements — Toasts, Mobile Sidebar, List Rename

## What Was Done

Three user experience improvements this run:

### 1. Toast Notification System

Replaced all browser `alert()` calls with a non-blocking toast notification system:
- Toast container positioned fixed at bottom-right
- Two styles: `success` (green) and `error` (red)
- Toasts auto-dismiss after 3.5 seconds with a fade-out animation
- Success toasts for: list created, list deleted, list renamed, task added, task deleted, task saved, completed tasks cleared
- Error toasts for all failure cases

### 2. Mobile Sidebar Drawer

The sidebar was previously hidden on mobile (`display: none`). Now:
- A hamburger menu button appears in the header on screens ≤ 640px
- Clicking it slides in the sidebar as a fixed drawer from the left (280px wide)
- A semi-transparent backdrop overlay blocks the rest of the page
- Selecting a list or tapping the backdrop closes the drawer
- A close (×) button appears in the sidebar header on mobile
- Smooth slide-in/out animation via CSS transform

### 3. Task List Rename

Users can now rename task lists:
- A pencil (edit) icon appears on hover next to the existing delete icon
- Clicking it puts the list name into inline edit mode
- Press Enter to save, Escape to cancel, or click away (blur) to save
- A flag prevents double-saves from blur + Enter firing together
- New API endpoint: **PATCH `/api/tasklists/:listId`** — updates task list title

## Verified

- `node --check server.js` passes
- No `alert()` calls remain in `index.html`
- All key functions present: `showToast`, `openMobileSidebar`, `closeMobileSidebar`, `startRenameList`, `saveRenameList`
- HTML tag balance verified (div open/close counts match)
- `npm start` runs successfully

## Turns Used

~14 turns

## What Comes Next

1. **Task reordering** — drag-and-drop or move up/down buttons to change task order within a list (uses Google Tasks API `tasks.move`)
2. **Subtasks** — the Google Tasks API supports parent/child task relationships; add collapsible subtasks
3. **Persistent session store** — in-memory sessions are lost on server restart; use a file-based or Redis store
4. **Deployment** — add a Procfile and/or Dockerfile for production deployment
5. **Search/filter** — search tasks by title or filter by status/due date
6. **Due date improvements** — highlight tasks due today, sort by due date option
