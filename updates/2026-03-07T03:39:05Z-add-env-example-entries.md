2026-03-07T00:00:00Z - Add env variables to .env.example

What I did

- Added a handful of optional environment variables to  to
  document defaults and make it easier for operators to enable test and
  enforcement behavior without needing to update README.

Why

- The README documents  and ,
  but  did not include them. Including them here makes local
  setup and CI configuration more discoverable.

Files changed

-  (add , ,
  and readiness probe flags)
-  (this file)

Tests

- Ran 
> tasklr@1.0.0 test:quick
> npm run test:filename-parsing && npm run test:validate-env


> tasklr@1.0.0 test:filename-parsing
> node scripts/test_filename_parsing.js

PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> £-pound.json
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed

> tasklr@1.0.0 test:validate-env
> node scripts/test_validate_env.js

PASS: missing SESSION_SECRET detected
PASS: validate_oauth_env passes with SESSION_SECRET
PASS: enforcement of weak session secret works
ALL TESTS PASSED before making this change; all quick checks passed.

Turn accounting

- Turn when started: 6
- Turns used for this update: 2
- Current turn: 8

Next steps

- Consider enabling  in CI to enforce strong
  session secrets on PRs/branches as desired.
