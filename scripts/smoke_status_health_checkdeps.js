#!/usr/bin/env node
// Wrapper for smoke status/health test that skips when node modules aren't installed.
const { spawn } = require('child_process');
const path = require('path');

function hasModule(name) {
  try { require.resolve(name); return true; } catch (e) { return false; }
}

if (!hasModule('express')) {
  console.log('Skipping smoke-status-health: required dependency not installed (express).');
  console.log('Run `npm install` to enable the full server-based smoke test.');
  process.exit(0);
}

const smokeScript = path.join(__dirname, 'smoke_status_health_test.js');
const child = spawn(process.execPath, [smokeScript], { stdio: 'inherit', env: process.env });
child.on('exit', code => process.exit(code));
