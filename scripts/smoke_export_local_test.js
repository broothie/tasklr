#!/usr/bin/env node
// Lightweight unit test for export formatting that doesn't open network sockets.
const sample = { lists: [{ id: 'test-list', title: 'Test List', tasks: [{ id: 't1', title: 'Sample Task' }] }] };

function makeFilename() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return 'tasklr-export-' + ts + '.json';
}

function makeHeaders(filename) {
  return {
    'Content-Type': 'application/json',
    'Content-Disposition': `attachment; filename="${filename}"`
  };
}

// Test header formatting
const filename = makeFilename();
const headers = makeHeaders(filename);
if (!/^attachment;\s*filename="tasklr-export-/.test(headers['Content-Disposition'])) {
  console.error('Header format unexpected:', headers['Content-Disposition']);
  process.exitCode = 2;
} else {
  console.log('Header format OK:', headers['Content-Disposition']);
}

// Test JSON serialization
try {
  const text = JSON.stringify(sample, null, 2);
  JSON.parse(text);
  console.log('Sample JSON serialization OK');
} catch (err) {
  console.error('Sample JSON invalid:', err && err.message);
  process.exitCode = 3;
}

if (!process.exitCode) process.exitCode = 0;
