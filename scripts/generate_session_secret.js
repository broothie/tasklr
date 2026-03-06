#!/usr/bin/env node
// Generate a secure random session secret
// Usage: node scripts/generate_session_secret.js [bytes]
const crypto = require('crypto');
const bytes = Number(process.argv[2]) || 32;
if (!Number.isFinite(bytes) || bytes <= 0) {
  console.error('Invalid number of bytes');
  process.exit(2);
}
console.log(crypto.randomBytes(bytes).toString('hex'));
