# 2026-03-04T03:45:28Z: Add  script to run unit + smoke checks

What I changed

- Added a new npm <command>

Usage:

npm install        install all the dependencies in your project
npm install <foo>  add the <foo> dependency to your project
npm test           run this project's tests
npm run <foo>      run the script named <foo>
npm <command> -h   quick help on <command>
npm -l             display usage info for all commands
npm help <term>    search for help on <term>
npm help npm       more involved overview

All commands:

    access, adduser, audit, bugs, cache, ci, completion,
    config, dedupe, deprecate, diff, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    help-search, hook, init, install, install-ci-test,
    install-test, link, ll, login, logout, ls, org, outdated,
    owner, pack, ping, pkg, prefix, profile, prune, publish,
    query, rebuild, repo, restart, root, run-script, sbom,
    search, set, shrinkwrap, star, stars, start, stop, team,
    test, token, uninstall, unpublish, unstar, update, version,
    view, whoami

Specify configs in the ini-formatted file:
    /home/runner/.npmrc
or on the command line via: npm <command> --key=value

More configuration info: npm help config
Configuration fields: npm help 7 config

npm@10.8.2 /opt/hostedtoolcache/node/20.20.0/x64/lib/node_modules/npm script  in  which runs the focused unit check, the local export smoke test, and the auth refresh unit check:



Why

- Provide a single CI-friendly script that exercises the core fast checks we have locally: filename-parsing unit check, the local export smoke test which validates server export/download behavior, and the token refresh unit tests. This makes it easy for CI to run a quick verification step.

Tests performed

- Ran 
> tasklr@1.0.0 test:ci
> npm run test && npm run smoke-export-local && npm run test:auth-refresh


> tasklr@1.0.0 test
> npm run test:filename-parsing


> tasklr@1.0.0 test:filename-parsing
> node scripts/test_filename_parsing.js

PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> £-pound.json
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed

> tasklr@1.0.0 smoke-export-local
> node scripts/smoke_export_local_test.js

Header format OK: attachment; filename="tasklr-export-2026-03-04T03-45-28-920Z.json"; filename*=UTF-8''tasklr-export-2026-03-04T03-45-28-920Z.json
Sample JSON serialization OK

> tasklr@1.0.0 test:auth-refresh
> node scripts/test_auth_refresh.js

ALL TESTS PASSED locally. All checks passed:

- Filename parsing unit check: all cases PASS
- Local export smoke test (spawns server with ): verifies  readiness and that  returns downloadable JSON with  header
- Auth refresh unit test: exercises  mocked paths and confirms expected refresh behavior and failure handling

Files changed

-  — added  script
-  — this update file

Turn accounting

- Turn when created: 7
- Turns used for this update: 3

Next steps

- Consider wiring 
> tasklr@1.0.0 test:ci
> npm run test && npm run smoke-export-local && npm run test:auth-refresh


> tasklr@1.0.0 test
> npm run test:filename-parsing


> tasklr@1.0.0 test:filename-parsing
> node scripts/test_filename_parsing.js

PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> £-pound.json
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed

> tasklr@1.0.0 smoke-export-local
> node scripts/smoke_export_local_test.js

Header format OK: attachment; filename="tasklr-export-2026-03-04T03-45-29-564Z.json"; filename*=UTF-8''tasklr-export-2026-03-04T03-45-29-564Z.json
Sample JSON serialization OK

> tasklr@1.0.0 test:auth-refresh
> node scripts/test_auth_refresh.js

ALL TESTS PASSED into CI (GitHub Actions) as a dedicated job / smoke step.
- Add additional lightweight checks for other critical endpoints (readiness, export filename UTF-8 handling) if desired.
