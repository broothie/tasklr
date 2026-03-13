#!/usr/bin/env node
// Lightweight test for the internal __test export route
'use strict';

// Skip if express (and other deps) are not installed.
try {
  require.resolve('express');
} catch (err) {
  console.log('SKIP: dependencies missing');
  process.exit(0);
}

// Enable test routes in server
process.env.ALLOW_TEST_ROUTES = '1';
const app = require('../server');
const http = require('http');

async function run() {
  const server = http.createServer(app);
  server.listen(0, async () => {
    const port = server.address().port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/__test/export?download=1`);
      if (!res.ok) throw new Error('non-ok status: ' + res.status);
      const cd = res.headers.get('content-disposition') || '';
      if (!/attachment/.test(cd)) throw new Error('Content-Disposition missing attachment');
      // Basic check: must include filename and/or filename*
      if (!(/filename=/.test(cd) || /filename\*/.test(cd))) throw new Error('filename not present in Content-Disposition');
      const text = await res.text();
      JSON.parse(text);
      console.log('PASS: __test/export?download=1 -> headers OK, JSON OK');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('FAIL: __test/export ->', err && err.message);
      server.close(() => process.exit(1));
    }
  });
}

run();
