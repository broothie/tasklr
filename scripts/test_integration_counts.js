#!/usr/bin/env node
// Lightweight integration smoke test: start the app with ALLOW_TEST_ROUTES=1
// and hit /__test/counts to verify a test-only counts route works.

process.env.ALLOW_TEST_ROUTES = '1';

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
  try {
    const r = await fetch(base + '/__test/counts');
    if (r.status !== 200) throw new Error('/__test/counts did not return 200');
    const j = await r.json();
    if (!j || typeof j !== 'object') throw new Error('/__test/counts payload unexpected');
    console.log('PASS: /__test/counts OK');
    process.exitCode = 0;
  } catch (err) {
    console.error('FAIL:', err && (err.stack || err));
    process.exitCode = 2;
  } finally {
    server.close();
  }
})();
