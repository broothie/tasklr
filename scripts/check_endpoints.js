#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const serverPath = path.join(__dirname, '..', 'server.js');
try {
  const src = fs.readFileSync(serverPath, 'utf8');
  const checks = [
    { pattern: "app.get('/api/status'", name: '/api/status' },
    { pattern: "app.get('/health'", name: '/health' }
  ];
  let ok = true;
  for (const c of checks) {
    if (src.indexOf(c.pattern) === -1) {
      console.error('MISSING:', c.name);
      ok = false;
    } else {
      console.log('FOUND :', c.name);
    }
  }
  process.exit(ok ? 0 : 2);
} catch (err) {
  console.error('ERROR reading server.js:', err && err.message);
  process.exit(3);
}
