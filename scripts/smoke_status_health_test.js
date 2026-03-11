#!/usr/bin/env node
const { spawn } = require('child_process');
const fetch = global.fetch || require('node-fetch');
const path = require('path');
const serverPath = path.join(__dirname, '..', 'server.js');

const PORT = process.env.PORT || 3002;
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
    const statusUrl = `http://localhost:${PORT}/api/status`;
    const res1 = await fetch(statusUrl);
    if (!res1.ok) {
      console.error('/api/status returned non-ok', res1.status);
      cleanup(3);
      return;
    }
    const j = await res1.json();
    if (!j.name || !j.version) {
      console.error('/api/status missing name/version', j);
      cleanup(4);
      return;
    }

    const healthUrl = `http://localhost:${PORT}/health`;
    const res2 = await fetch(healthUrl);
    if (!res2.ok) {
      console.error('/health returned non-ok', res2.status);
      cleanup(5);
      return;
    }
    const hj = await res2.json();
    if (hj.status !== 'ok') {
      console.error('/health returned unexpected payload', hj);
      cleanup(6);
      return;
    }

    console.log('Smoke tests passed: /api/status and /health OK');
    cleanup(0);
  } catch (err) {
    console.error('Smoke test failed:', err && err.message);
    cleanup(7);
  }
})();
