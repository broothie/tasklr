#!/usr/bin/env node
// Validate required OAuth environment variables and redirect URI
// Try to load dotenv if available; otherwise fall back to parsing a local .env file.
try {
  require('dotenv').config();
} catch (e) {
  const fs = require('fs');
  const p = '.env';
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p,'utf8');
    for (const line of c.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) {
        const key = m[1];
        let val = m[2];
        // strip surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1,-1);
        }
        process.env[key] = val;
      }
    }
  }
}

// Require these env vars for a minimally functional server
const required = ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','BASE_URL','SESSION_SECRET'];
let ok = true;
for (const k of required) {
  if (!process.env[k]) {
    console.error('MISSING: ' + k);
    ok = false;
  }
}
if (!ok) {
  console.error('\nPlease create a .env file with the variables above, or export them in your environment.');
  process.exit(2);
}

// Check BASE_URL shape
const baseRaw = process.env.BASE_URL || '';
const base = baseRaw.replace(/\/$/, '');
if (!/^https?:\/\//i.test(base)) {
  console.warn('BASE_URL does not look like a full URL (missing http:// or https://):', baseRaw);
  console.warn('It is recommended to include the scheme, e.g. http://localhost:3000');
}

// Check redirect URI
const expected = base + '/auth/callback';
const redirectUris = (process.env.GOOGLE_REDIRECT_URIS || '').split(',').map(s=>s.trim()).filter(Boolean);
const found = redirectUris.includes(expected) || process.env.GOOGLE_REDIRECT_URI === expected;
console.log('BASE_URL:', base);
console.log('Expected redirect URI:', expected);
if (found) {
  console.log('Redirect URI check: OK');
} else {
  console.warn('Redirect URI check: FAILED');
  console.warn('Set either GOOGLE_REDIRECT_URI to the exact callback URI, or GOOGLE_REDIRECT_URIS to a comma-separated list that includes the callback.');
  console.warn('\nExample .env lines:');
  console.warn('  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
  console.warn('  GOOGLE_CLIENT_SECRET=your-secret');
  console.warn('  BASE_URL=http://localhost:3000');
  console.warn('  SESSION_SECRET=a-long-random-string');
  console.warn('  GOOGLE_REDIRECT_URI=' + expected);
  ok = false;
}

// Warn or fail if SESSION_SECRET is present but likely too short for production
// If FAIL_ON_WEAK_SESSION_SECRET is set to 1 or true (case-insensitive), treat
// a short session secret as a fatal error. Otherwise emit a warning.
const sess = process.env.SESSION_SECRET || '';
if (sess && sess.length < 16) {
  const enforce = /^(1|true)$/i.test(process.env.FAIL_ON_WEAK_SESSION_SECRET || '');
  if (enforce) {
    console.error('ERROR: SESSION_SECRET is shorter than 16 characters and FAIL_ON_WEAK_SESSION_SECRET is set; refusing to continue.');
    ok = false;
  } else {
    console.warn('WARNING: SESSION_SECRET is shorter than 16 characters — consider using a longer random string in production.');
  }
}
if (ok) {
  console.log('\nAll checks passed.');
  process.exit(0);
} else {
  process.exit(3);
}
