const fs = require('fs');
const path = require('path');

try {
  const file = path.join(__dirname, '..', 'views', 'index.html');
  const src = fs.readFileSync(file, 'utf8');
  const needle = "encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)";
  if (src.indexOf(needle) === -1) {
    console.error('FAILED: Expected to find reauth hash inclusion in views/index.html');
    process.exit(1);
  }
  console.log('OK: reauth includes window.location.hash');
  process.exit(0);
} catch (err) {
  console.error('ERROR', err && err.message);
  process.exit(1);
}
