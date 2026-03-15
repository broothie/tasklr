// Simple dependency-free test wrapper for /health endpoint
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
      const res = await fetch(`http://127.0.0.1:${port}/health`);
      if (!res.ok) throw new Error('non-ok status: ' + res.status);
      const data = await res.json();
      if (data && data.status === 'ok') {
        console.log('PASS: /health -> ok');
        server.close(() => process.exit(0));
      } else {
        throw new Error('unexpected body: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('FAIL: /health ->', err && err.message);
      server.close(() => process.exit(1));
    }
  });
}

run();
