// Helper to validate that a client-supplied return path is safe to store
function isSafeReturnTo(nextUrl) {
  if (!nextUrl || typeof nextUrl !== 'string') return false;
  // Limit length to a sensible maximum to avoid abuse
  if (nextUrl.length > 2000) return false;
  // must be a relative path starting with a single '/'
  if (!nextUrl.startsWith('/')) return false;
  // disallow protocol-relative '//' which could be abused
  if (nextUrl.startsWith('//')) return false;
  // disallow backslashes or CR/LF which could be used in header injection
  if (nextUrl.indexOf('\\') !== -1) return false;
  if (nextUrl.indexOf('\n') !== -1 || nextUrl.indexOf('\r') !== -1) return false;
  // disallow embedded scheme-like sequences that are percent-encoded (e.g. '%2f%2f')
  const lower = nextUrl.toLowerCase();
  if (lower.indexOf('%2f%2f') !== -1) return false;
  // further constraints could be added here (e.g., allowed prefixes)
  return true;
}
module.exports = { isSafeReturnTo };
