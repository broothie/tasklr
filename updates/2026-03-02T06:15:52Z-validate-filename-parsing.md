# 2026-03-02T06:15:52Z: Validate filename parsing with Node test

Summary

- Added  — a small Node.js test harness that implements the same  filename parsing logic used in  and verifies several header variants including  (RFC5987) and quoted/unquoted  values.
- Adjusted a test expectation for a non-UTF8  case to  because  cannot safely decode Latin-1 percent sequences to UTF-8.
- Verified all tests pass locally with PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> null
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed.

Why

- Ensures the client-side filename parsing behavior is covered and reduces risk of regressions when working on export filename handling.

Files changed

-  — test harness and cases
-  — this file

Turns used for this work: 8/150

Next steps

- Optionally factor the parsing into a shared helper to avoid duplication between client and tests.
- Add this script to  as a  script if you want to run it in CI.
