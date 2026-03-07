# Add `test:api-me` npm script

What I changed

- Added a lightweight npm script `test:api-me` to `package.json` that runs `node scripts/test_api_me.js`.

Why

- `scripts/test_api_me.js` is a small smoke/integration test that starts the app with `ALLOW_TEST_ROUTES=1` and validates the `/__test/me` payload. Adding a `npm` script makes it easy to run locally and include in CI workflows.

Tests performed

- Did not run the script here because project dependencies are not installed in this environment (`node_modules` absent). To run locally:

```
npm ci
npm run test:api-me
```

Files changed

- `package.json` — added `test:api-me` script

Turns used

- This update created in assistant turn: 10

Next steps

- Optionally add `test:api-me` to CI smoke steps (create a separate GitHub Actions workflow) so it runs on push.
