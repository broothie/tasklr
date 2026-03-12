// scripts/test_status.js
// Simple dependency-free test wrapper for /api/status endpoint
'use strict';

// If express (and other deps) are not installed, skip the test.
try {
  require.resolve('express');
} catch (err) {
  console.log('SKIP: dependencies missing');
  process.exit(0);
}

const app = require('../server');
const http = require('http');

function run() {
  const server = http.createServer(app);
  server.listen(0, async () => {
    const port = server.address().port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/status`);
      if (!res.ok) throw new Error('non-ok status: ' + res.status);
      const data = await res.json();
      console.log('PASS: /api/status ->', data.name || '(no-name)', data.version || '(no-version)');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('FAIL: /api/status ->', err && err.message);
      server.close(() => process.exit(1));
    }
  });
}

run();
