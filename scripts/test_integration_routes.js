#!/usr/bin/env node
// Lightweight integration smoke test: start the app with ALLOW_TEST_ROUTES=1
// and hit /__test/export and /__test/me to verify wiring without OAuth.

process.env.ALLOW_TEST_ROUTES = '1';

// If runtime dependencies (e.g. express) are not installed, skip this
// integration test so the script remains safe to run in dependency-free
// environments used elsewhere in this repository.
try {
  require.resolve('express');
} catch (e) {
  console.log('SKIP: runtime dependencies missing (express).');
  process.exit(0);
}

const app = require('../server');

(async function(){
  const server = app.listen(0);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const results = [];
  try {
    // Use global fetch (Node 18+)
    const r1 = await fetch(base + '/__test/export');
    if (r1.status !== 200) throw new Error('/__test/export did not return 200');
    const j1 = await r1.json();
    if (!j1 || !j1.lists) {
      throw new Error('/__test/export payload unexpected');
    }
    results.push({ route: '/__test/export', ok: true });

    const r2 = await fetch(base + '/__test/me');
    if (r2.status !== 200) throw new Error('/__test/me did not return 200');
    const j2 = await r2.json();
    if (!j2 || j2.authenticated !== true) throw new Error('/__test/me payload unexpected');
    results.push({ route: '/__test/me', ok: true });

    console.log('PASS: integration routes OK');
    process.exitCode = 0;
  } catch (err) {
    console.error('FAIL:', err && (err.stack || err));
    process.exitCode = 2;
  } finally {
    server.close();
  }
})();
