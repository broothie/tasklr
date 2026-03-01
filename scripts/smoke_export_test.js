#!/usr/bin/env node
const { spawn } = require('child_process');
const fetch = global.fetch || require('node-fetch');
const path = require('path');
const serverPath = path.join(__dirname, '..', 'server.js');

const PORT = process.env.PORT || 3001;
const env = Object.assign({}, process.env, { ALLOW_TEST_ROUTES: '1', PORT: String(PORT) });

console.log('Starting server for smoke test on port', PORT);
const child = spawn(process.execPath, [serverPath], { env, stdio: ['ignore', 'inherit', 'inherit'] });

let exited = false;
function cleanup(code) {
  if (exited) return;
  exited = true;
  try { child.kill(); } catch (e) {}
  process.exit(code);
}

// wait for /api/status to respond
async function waitForReady() {
  const url = `http://localhost:${PORT}/api/status`;
  const deadline = Date.now() + 15_000; // 15s
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 300));
  }
  return false;
}

(async () => {
  const ready = await waitForReady();
  if (!ready) {
    console.error('Server did not become ready in time');
    cleanup(2);
    return;
  }

  try {
    const expUrl = `http://localhost:${PORT}/__test/export?download=1`;
    const res = await fetch(expUrl);
    const cd = res.headers.get('content-disposition') || '';
    if (!/attachment;\s*filename=\"tasklr-export-/.test(cd)) {
      console.error('Unexpected Content-Disposition header:', cd);
      cleanup(3);
      return;
    }
    const text = await res.text();
    try {
      JSON.parse(text);
    } catch (e) {
      console.error('Response body is not valid JSON');
      cleanup(4);
      return;
    }
    console.log('Smoke test passed: export endpoint returned downloadable JSON with Content-Disposition header');
    cleanup(0);
  } catch (err) {
    console.error('Smoke test failed:', err && err.message);
    cleanup(5);
  }
})();
