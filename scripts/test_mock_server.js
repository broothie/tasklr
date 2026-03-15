#!/usr/bin/env node
// Test the mock Google Tasks server (dependency-free)
const { createApp } = require('./mock_google_tasks_server');

(async function(){
  const server = createApp();
  // Bind to loopback explicitly to avoid permission errors in sandboxed envs
  server.listen(0, '127.0.0.1');
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  try {
    const r1 = await fetch(base + '/users/@me/lists');
    if (r1.status !== 200) throw new Error('lists status ' + r1.status);
    const j1 = await r1.json();
    if (!j1 || !Array.isArray(j1.items)) throw new Error('lists payload unexpected');

    const listId = j1.items[0] && j1.items[0].id;
    if (!listId) throw new Error('no list id');

    const r2 = await fetch(base + '/lists/' + encodeURIComponent(listId) + '/tasks');
    if (r2.status !== 200) throw new Error('tasks status ' + r2.status);
    const j2 = await r2.json();
    if (!j2 || !Array.isArray(j2.items)) throw new Error('tasks payload unexpected');

    const r3 = await fetch(base + '/lists/' + encodeURIComponent(listId) + '/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New from test' })
    });
    if (r3.status !== 200) throw new Error('post task status ' + r3.status);
    const j3 = await r3.json();
    if (!j3 || !j3.id) throw new Error('posted task missing id');

    console.log('PASS: mock server basic flows OK');
    process.exitCode = 0;
  } catch (err) {
    console.error('FAIL:', err && (err.stack || err));
    process.exitCode = 2;
  } finally {
    server.close();
  }
})();
