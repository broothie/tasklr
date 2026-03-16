#!/usr/bin/env node
// Run dependency-free smoke checks: export route static/live check and /__test/me
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function hasModule(name) {
  try {
    require.resolve(name);
    return true;
  } catch (e) { return false; }
}

// First: run the export route test which already falls back to static checks.
const exportScript = path.join(__dirname, 'smoke_export_route_test.js');
console.log('Running', exportScript);
let r = spawnSync(process.execPath, [exportScript], { stdio: 'inherit', env: Object.assign({}, process.env, { ALLOW_TEST_ROUTES: '1' }) });
if (r.error) { console.error('Failed to spawn', exportScript, r.error); process.exit(2); }
if (r.status !== 0) { console.error('Export test failed', r.status); process.exit(r.status || 1); }

// Next: try live /__test/me by running test_api_me.js only if dependencies present.
if (hasModule('express')) {
  const meScript = path.join(__dirname, 'test_api_me.js');
  console.log('Running', meScript);
  r = spawnSync(process.execPath, [meScript], { stdio: 'inherit', env: Object.assign({}, process.env, { ALLOW_TEST_ROUTES: '1' }) });
  if (r.error) { console.error('Failed to spawn', meScript, r.error); process.exit(2); }
  if (r.status !== 0) { console.error('Test failed:', meScript, 'exit', r.status); process.exit(r.status || 1); }
  console.log('All depfree smoke checks passed (live)');
  process.exit(0);
} else {
  // Fallback: static check for presence of /__test/me in server.js
  console.log('Dependencies missing; performing static check for /__test/me in server.js');
  try {
    const src = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
    const idx = src.indexOf('/__test/me');
    if (idx === -1) {
      console.error('Static check failed: /__test/me not found in server.js');
      process.exit(3);
    }
    console.log('Static check OK: /__test/me present');
    console.log('All depfree smoke checks passed (static)');
    process.exit(0);
  } catch (err) {
    console.error('Static check failed', err && err.message);
    process.exit(4);
  }
}
