# 2026-03-02T12:07:13Z: Factor filename parser into shared lib

What I changed

- Extracted Content-Disposition filename parsing logic into  and exported .
- Updated  to import and reuse the shared parser instead of duplicating the logic.

Why

- This reduces duplication and makes the parsing logic available to other Node-side code (e.g., server-side rendering or future server tests).
- It was suggested in earlier update notes to factor the parsing into a shared helper; this implements that small refactor.

Tests performed

- Ran PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> null
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed locally; all tests passed.

Files changed

- 
- 

Turn accounting

- Turn when created: 4
- Turns used for this update: 2

Next steps

- Consider exposing the parsing to client-side code during a build step or by adding a small endpoint that returns the suggested filename for a  header.
- Add 
> tasklr@1.0.0 test:filename-parsing
> node scripts/test_filename_parsing.js

PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> null
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed to CI smoke steps so filename parsing is checked in CI.

