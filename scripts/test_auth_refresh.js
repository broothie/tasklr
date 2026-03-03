// Simple unit tests for refreshTokensIfNeeded using a mocked oauth2 client.
const assert = require('assert');
const { refreshTokensIfNeeded } = require('../lib/auth');

async function run() {
  // Case 1: no session tokens
  let session = {};
  let res = await refreshTokensIfNeeded(session, () => null);
  assert.strictEqual(res, null, 'Should return null when no tokens present');

  // Case 2: expiry far in future -> returns original tokens
  session = { tokens: { expiry_date: Date.now() + 20 * 60 * 1000, access_token: 'a' } };
  res = await refreshTokensIfNeeded(session, () => { throw new Error('should not be called'); });
  assert.strictEqual(res, session.tokens, 'Should return existing tokens when not near expiry');

  // Case 3: expiry soon -> uses refreshAccessToken
  let refreshedCreds = { access_token: 'new-a', expiry_date: Date.now() + 60*60*1000 };
  session = { tokens: { expiry_date: Date.now() + 2 * 60 * 1000, access_token: 'old-a', refresh_token: 'r1' } };
  const factory1 = () => ({
    setCredentials: () => {},
    refreshAccessToken: async () => ({ credentials: refreshedCreds }),
  });
  res = await refreshTokensIfNeeded(session, factory1);
  assert.deepStrictEqual(res, refreshedCreds, 'Should return refreshed credentials from refreshAccessToken');
  assert.deepStrictEqual(session.tokens, refreshedCreds, 'Session tokens should be updated');

  // Case 4: expiry soon -> getAccessToken path
  refreshedCreds = { access_token: 'new-b', expiry_date: Date.now() + 60*60*1000 };
  session = { tokens: { expiry_date: Date.now() + 2 * 60 * 1000, access_token: 'old-b' } };
  const factory2 = () => ({
    setCredentials: () => {},
    getAccessToken: async () => ({ token: refreshedCreds.access_token }),
    credentials: refreshedCreds,
  });
  res = await refreshTokensIfNeeded(session, factory2);
  assert.deepStrictEqual(res, refreshedCreds, 'Should return credentials after getAccessToken');

  // Case 5: refresh fails -> returns null
  session = { tokens: { expiry_date: Date.now() + 2 * 60 * 1000, access_token: 'x', refresh_token: 'r2' } };
  const factory3 = () => ({ setCredentials: () => {}, refreshAccessToken: async () => { throw new Error('fail'); } });
  res = await refreshTokensIfNeeded(session, factory3);
  assert.strictEqual(res, null, 'Should return null when refresh fails');

  console.log('ALL TESTS PASSED');
}

run().catch(err => { console.error(err); process.exit(1); });
