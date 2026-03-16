// Dependency-free static check that server exposes /api/tasklists/counts
// and the client implements updateListCounts that will use it.
const fs = require('fs');
const path = require('path');
try {
  const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  if (server.indexOf("/api/tasklists/counts") === -1) {
    console.error('Counts endpoint not found in server.js');
    process.exit(2);
  }
  const view = fs.readFileSync(path.join(__dirname, '..', 'views', 'index.html'), 'utf8');
  if (view.indexOf('updateListCounts(') === -1 && view.indexOf('list-count-') === -1) {
    console.error('Client-side counts markup/function not found in views/index.html');
    process.exit(3);
  }
  console.log('PASS: counts endpoint and client-side counts references present');
  process.exit(0);
} catch (err) {
  console.error('ERROR reading files:', err && err.message);
  process.exit(4);
}
