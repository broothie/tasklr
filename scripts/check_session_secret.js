#!/usr/bin/env node
// Check SESSION_SECRET strength for local/dev use and optional enforcement
const sessionSecret = process.env.SESSION_SECRET || '';
const isDevPlaceholder = sessionSecret === 'dev-secret-change-in-prod';
const isTooShort = sessionSecret && sessionSecret.length < 16;
const isMissingOrWeak = !sessionSecret || isDevPlaceholder || isTooShort;
if (!isMissingOrWeak) {
  console.log('OK: SESSION_SECRET present and appears strong');
  process.exit(0);
}
const msg = 'WARNING: SESSION_SECRET is missing or weak. Set SESSION_SECRET to a long random string before running in production. You can generate one with: npm run gen-secret';
console.warn(msg);
// Optionally fail when enforcement env var is set
const enforce = process.env.FAIL_ON_WEAK_SESSION_SECRET === '1' || process.env.FAIL_ON_WEAK_SESSION_SECRET === 'true';
if (enforce) {
  console.error('FAIL: enforcement enabled (FAIL_ON_WEAK_SESSION_SECRET=1) — exiting with code 1');
  process.exit(1);
}
process.exit(0);
