# 0027 Add README note for check:export

What I did:

- Added a short README entry documenting `npm run check:export`, a dependency-free quick check that verifies the `/api/export` route sets `Content-Disposition` and includes UTF-8 `filename*` or uses `encodeURIComponent`.
- Created this update file `updates/0027-add-check-export-readme.md` describing the change.

Why:

- The repository already contains `scripts/check_export_filename.js` and an npm script `check:export` but the README did not mention it; documenting it helps maintainers run the quick export filename check without installing dependencies.

Files changed:

- `README.md`
- `updates/0027-add-check-export-readme.md`

Test and verification:

- Ran a simple syntax check (no new JS logic added).

Turns used for this update: 1

Turn count when writing: 3/150
