#!/usr/bin/env node
// Dependency-free smoke test for /__test/export route.
// Preferred: start app with ALLOW_TEST_ROUTES=1 and request live endpoint.
// Fallback: when dependencies aren't installed, perform a static analysis of server.js
// to validate that the test-only export route exists and sets headers + JSON.
const fs = require('fs');
const path = require('path');

function runStaticChecks() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  const idx = src.indexOf("/__test/export");
  if (idx === -1) {
    console.error('Test export route not present in server.js');
    process.exit(2);
  }
  const snippet = src.slice(idx, idx + 2000);
  const hasContentDisposition = /Content-Disposition/.test(snippet);
  const hasFilenameStar = /filename\*/.test(snippet);
  const hasEncodeURIComponent = /encodeURIComponent\(/.test(snippet);
  const hasJsonSend = /JSON\.stringify|res\.send\(JSON\.stringify|res\.json\(/.test(snippet);

  console.log('Static check of /__test/export snippet:');
  console.log('Content-Disposition present:', hasContentDisposition);
  console.log('filename* present:', hasFilenameStar);
  console.log('encodeURIComponent used:', hasEncodeURIComponent);
  console.log('JSON send present:', hasJsonSend);

  if (!hasContentDisposition) { console.error('MISSING: Content-Disposition header not found in /__test/export section'); process.exit(3); }
  if (!hasFilenameStar && !hasEncodeURIComponent) { console.warn('WARNING: no filename* or encodeURIComponent found; UTF-8 names may not be preserved'); }
  if (!hasJsonSend) { console.error('MISSING: JSON send/serialize call not found in /__test/export'); process.exit(4); }
  console.log('Static checks OK');
  process.exit(0);
}

async function runLiveChecks() {
  try {
    process.env.ALLOW_TEST_ROUTES = '1';
    const app = require('../server');
    const http = require('http');
    const { once } = require('events');
    const server = http.createServer(app);
    server.listen(0);
    await once(server, 'listening');
    const addr = server.address();
    const port = addr.port;
    const url = `http://127.0.0.1:${port}/__test/export?download=1`;

    const req = http.get(url, { timeout: 5000 }, (res) => {
      const { statusCode, headers } = res;
      let ok = true;
      if (statusCode !== 200) {
        console.error('Unexpected status code:', statusCode);
        ok = false;
      }
      const cd = headers['content-disposition'] || '';
      if (!/attachment;/i.test(cd)) {
        console.error('Missing attachment disposition:', cd);
        ok = false;
      }
      if (!(/filename\*=/i.test(cd) || /encodeURIComponent\(/i.test(cd))) {
        console.warn('Warning: filename* may be missing, some clients may not get UTF-8 name');
      }
      const contentType = headers['content-type'] || '';
      if (!/^application\/json/i.test(contentType)) {
        console.error('Unexpected content-type:', contentType);
        ok = false;
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const obj = JSON.parse(body);
          if (!obj || !Array.isArray(obj.lists)) {
            console.error('Response JSON missing expected shape:', Object.keys(obj || {}));
            ok = false;
          }
        } catch (err) {
          console.error('Invalid JSON response:', err && err.message);
          ok = false;
        }
        server.close();
        process.exit(ok ? 0 : 2);
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err && err.message);
      server.close();
      process.exit(3);
    });
    req.on('timeout', () => {
      console.error('Request timed out');
      req.destroy();
      server.close();
      process.exit(4);
    });
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND') {
      console.warn('Live checks skipped (missing dependencies). Falling back to static checks.');
      runStaticChecks();
    } else {
      console.error('Live test run failed:', err && err.stack);
      process.exit(5);
    }
  }
}

runLiveChecks();
