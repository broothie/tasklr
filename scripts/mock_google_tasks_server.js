#!/usr/bin/env node
// Minimal mock Google Tasks API server (dependency-free)
// Supports:
// GET  /users/@me/lists
// GET  /lists/:listId/tasks
// POST /lists/:listId/tasks  (expects JSON {title})

const http = require('http');
const { URL } = require('url');

function createApp() {
  const lists = [ { id: 'l1', title: 'Inbox' } ];
  const tasks = { l1: [ { id: 't1', title: 'Example task', status: 'needsAction' } ] };

  function json(res, code, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(code, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(body);
  }

  function parseBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', c => data += c);
      req.on('end', () => {
        if (!data) return resolve(null);
        try { resolve(JSON.parse(data)); } catch (err) { reject(err); }
      });
      req.on('error', reject);
    });
  }

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
        return res.end();
      }
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;

      // GET /users/@me/lists
      if (req.method === 'GET' && pathname === '/users/@me/lists') {
        return json(res, 200, { items: lists });
      }

      // GET /lists/:listId/tasks
      let m = pathname.match(/^\/lists\/(.+?)\/tasks$/);
      if (req.method === 'GET' && m) {
        const listId = decodeURIComponent(m[1]);
        const items = tasks[listId] || [];
        return json(res, 200, { items });
      }

      // POST /lists/:listId/tasks
      if (req.method === 'POST' && m) {
        const listId = decodeURIComponent(m[1]);
        const body = await parseBody(req);
        const title = body && body.title ? String(body.title) : 'Untitled';
        const id = 't' + (Math.random().toString(36).slice(2,9));
        const t = { id, title, status: 'needsAction' };
        tasks[listId] = tasks[listId] || [];
        tasks[listId].push(t);
        return json(res, 200, t);
      }

      // Not found
      json(res, 404, { error: 'not_found' });
    } catch (err) {
      json(res, 500, { error: 'server_error', message: String(err && err.message) });
    }
  });

  return server;
}

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  const server = createApp();
  server.listen(port, () => console.log('Mock Google Tasks server listening on', port));
}

module.exports = { createApp };
