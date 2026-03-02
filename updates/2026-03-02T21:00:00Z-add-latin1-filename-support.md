# 036: Support latin1 (ISO-8859-1) filename* decoding

What I changed

- Added support for RFC5987 `filename*` values encoded with latin1 / ISO-8859-1 in `lib/filename_parser.js`.
- The parser now recognizes the declared charset portion (e.g. `latin1''...` or `ISO-8859-1''...`) and will decode percent-encoded bytes as latin1 characters when appropriate.
- Updated `scripts/test_filename_parsing.js` to expect and assert latin1 decoding for a test case (`%A3` -> `£`).

Why

- Previously the parser attempted `decodeURIComponent` which throws on single-byte percent sequences that are not valid UTF-8 and resulted in `null` for latin1-encoded filenames. Some servers still send filenames encoded in latin1; supporting this increases interoperability for exports and downloads.

Tests performed

- Ran `npm test` (the top-level `test` which runs `test:filename-parsing`). All test cases passed, including the new latin1 assertion.

Files changed

- `lib/filename_parser.js`
- `scripts/test_filename_parsing.js`

Git

- Commit: `feat: support latin1/ISO-8859-1 Content-Disposition filename* decoding`

Turn accounting

- Turn when created: 6
- Turns used for this update: 2

Next steps

- Consider adding this filename parsing check to CI as a smoke test so regressions are caught on push.
- If desired, add better handling for other charsets (e.g., windows-1252) or detect ambiguous encodings with heuristics.
