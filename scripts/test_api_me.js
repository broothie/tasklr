// Lightweight test for /__test/me route
process.env.ALLOW_TEST_ROUTES='1';
const serverModule = require('../server');
const http = require('http');
(async () => {
  try {
    // Start server on ephemeral port
    const srv = serverModule.listen(0);
    const port = srv.address().port;
    const url = `http://127.0.0.1:${port}/__test/me`;
    // Use global fetch (node 20+) or fallback
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Non-OK response', res.status);
      srv.close();
      process.exit(1);
    }
    const data = await res.json();
    const ok = data && typeof data.name === 'string' && data.tokens && typeof data.tokens.expiry_date === 'number' && data.authenticated === true;
    if (!ok) {
      console.error('Unexpected payload', data);
      srv.close();
      process.exit(1);
    }
    console.log('OK', data);
    srv.close();
    process.exit(0);
  } catch (err) {
    console.error('Test failed', err && err.message);
    process.exit(1);
  }
})();
