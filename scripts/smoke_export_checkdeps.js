#!/usr/bin/env node
// Wrapper for smoke export test that skips when node modules aren't installed.
const { spawn } = require('child_process');
const path = require('path');

function hasModule(name) {
  try {
    require.resolve(name);
    return true;
  } catch (e) {
    return false;
  }
}

if (!hasModule('express') || !hasModule('express-session')) {
  console.log('Skipping smoke-export: required dependencies not installed (express / express-session).');
  console.log('Run `npm install` to enable the full server-based smoke test.');
  process.exit(0);
}

const smokeScript = path.join(__dirname, 'smoke_export_test.js');
const child = spawn(process.execPath, [smokeScript], { stdio: 'inherit', env: process.env });
child.on('exit', code => process.exit(code));
