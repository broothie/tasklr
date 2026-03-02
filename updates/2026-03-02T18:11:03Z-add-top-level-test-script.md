# TIMESTAMP: Add top-level `test` script to package.json

What I changed

- Added a top-level `test` script to `package.json` that runs the existing `test:filename-parsing` script.

Why

- Some CI systems and common developer workflows expect a `test` script. Exposing a standard `test` target makes it easier to run the filename parsing check and integrate with CI smoke steps.

Tests performed

- Ran `npm test` which runs `npm run test:filename-parsing`.
- Output:

```
PASS: attachment; filename*=UTF-8''%E2%9C%93-%E6%96%87.json -> ✓-文.json
PASS: attachment; filename="simple-export.json" -> simple-export.json
PASS: inline; filename*=utf-8''%E2%9C%93-file.json; filename=bad.json -> ✓-file.json
PASS: attachment; filename*=latin1''%A3-pound.json -> null
PASS:  -> null
PASS: attachment; filename=unquoted-name.json -> unquoted-name.json
All filename parsing tests passed
```

Files changed

- `package.json`

Turn accounting

- Turn when created: 4
- Turns used for this update: 2

Next steps

- Consider adding this check to CI as a dedicated smoke test job so filename parsing is verified on every push.
- Consider improving parser behavior for non-UTF8 encodings (latin1) if we want to support legacy servers.

