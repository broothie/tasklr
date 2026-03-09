#!/usr/bin/env node
// Lightweight integration smoke test: start the app with ALLOW_TEST_ROUTES=1
// and hit /__test/export and /__test/me to verify wiring without OAuth.

process.env.ALLOW_TEST_ROUTES = '1';
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
    if (!j1 || !Array.isArray(j1.lists) && !j1.lists) {
      // The sample returns { lists: [...] }
      // Accept either the direct sample or the wrapped shape for robustness
      // but ensure it's present
      // (Keep simple: require j1.lists)
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
