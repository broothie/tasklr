// Extracted token refresh helper to make it testable.
// refreshTokensIfNeeded(session, oauth2Factory)

async function refreshTokensIfNeeded(session, oauth2Factory) {
  if (!session || !session.tokens) return null;

  const { expiry_date, refresh_token } = session.tokens;
  const now = Date.now();

  // If token will expire in the next 5 minutes, refresh it
  if (expiry_date && expiry_date - now < 5 * 60 * 1000) {
    try {
      const oauth2Client = oauth2Factory();
      oauth2Client.setCredentials(session.tokens);

      // Older googleapis helper
      if (typeof oauth2Client.refreshAccessToken === 'function') {
        const refreshed = await oauth2Client.refreshAccessToken();
        const credentials = refreshed && refreshed.credentials ? refreshed.credentials : refreshed;
        session.tokens = credentials;
        return credentials;
      }

      // Newer googleapis - calling getAccessToken may trigger an automatic refresh
      if (typeof oauth2Client.getAccessToken === 'function') {
        await oauth2Client.getAccessToken();
        const credentials = oauth2Client.credentials || session.tokens;
        session.tokens = credentials;
        return credentials;
      }

      // Fallback: if refresh_token is available try refreshToken
      if (refresh_token && typeof oauth2Client.refreshToken === 'function') {
        const refreshed = await oauth2Client.refreshToken(refresh_token);
        const credentials = refreshed && refreshed.credentials ? refreshed.credentials : refreshed;
        session.tokens = credentials;
        return credentials;
      }

      return null;
    } catch (err) {
      // Keep original behavior: log and return null
      if (typeof console !== 'undefined' && console.error) console.error('Token refresh failed:', err);
      return null;
    }
  }

  return session.tokens;
}

module.exports = { refreshTokensIfNeeded };
