const { isSafeReturnTo } = require('../lib/auth_helpers');
const cases = [
  { val: '/foo', ok: true },
  { val: '/', ok: true },
  { val: '/foo?bar=1', ok: true },
  { val: '//evil.example.com', ok: false },
  { val: 'http://example.com', ok: false },
  { val: 'https://example.com', ok: false },
  { val: '', ok: false },
  { val: null, ok: false },
  { val: undefined, ok: false },
  { val: '/\u202e', ok: true },
  // New cases to guard against header/control-char/backslash abuse
  { val: '/path\\with\\backslash', ok: false },
  { val: '/path%2f%2fbad', ok: false },
  { val: '/' + 'a'.repeat(2001), ok: false },
  // Percent-encoded CR/LF should be rejected
  { val: '/bad%0a', ok: false },
  { val: '/bad%0A', ok: false },
  { val: '/bad%0d', ok: false },
];
let failed = 0;
for (const c of cases) {
  const got = isSafeReturnTo(c.val);
  if (got !== c.ok) {
    console.error('Case failed', c, 'got', got);
    failed++;
  }
}
if (failed) {
  console.error('FAILED', failed, 'cases');
  process.exit(1);
}
console.log('All isSafeReturnTo tests passed');
process.exit(0);
