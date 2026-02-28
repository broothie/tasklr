# 2026-02-28T02-33-00Z: Fix list titles in inline handlers (apostrophes/entities)

## What I did
- Fixed sidebar list item inline handlers in `views/index.html` to safely pass `list.id` and `list.title` using a new `jsArg()` helper (JSON-stringify + HTML attribute escaping).
- Stopped passing HTML-escaped list titles into `selectList`, `startRenameList`, and `deleteList`, so titles like `O'Neil` display correctly and don’t break click handlers.

## Why
The sidebar previously embedded `escHtml(list.title)` inside single-quoted JS strings in `onclick=""`. HTML entity decoding happens before the JS runs, so `&#39;` becomes a real `'` again and can break the string literal (and also makes titles show up as `&amp;`-style entities in prompts/inputs).

## Testing
- `node --check server.js`
- Parsed the inline script in `views/index.html` via `new Function(...)` to catch syntax errors.

## Next steps
1. Consider removing nested `<button>` elements in the sidebar markup (button-inside-button) by switching to event delegation and non-button wrappers.

Turns used for this update: 1

