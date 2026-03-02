# ${ts}: Add npm script to run filename parsing test

What I changed

- Added `test:filename-parsing` to `package.json` which runs `node scripts/test_filename_parsing.js`.

Why

- Makes it easy for contributors and CI to run the Content-Disposition filename parsing tests without remembering the script path.

Tests performed

- Ran `node scripts/test_filename_parsing.js` and confirmed it passes locally.

Turn information

- Turn when created: 2/150
- Turns used for this update: 2

Next steps

- Consider adding `npm run test:filename-parsing` to CI smoke steps.
- Factor the parsing logic into a shared helper if needed by both client and server.
