// Helper to validate that a client-supplied return path is safe to store
function isSafeReturnTo(nextUrl) {
  if (!nextUrl || typeof nextUrl !== 'string') return false;
  // must be a relative path starting with a single '/'
  if (!nextUrl.startsWith('/')) return false;
  // disallow protocol-relative '//' which could be abused
  if (nextUrl.startsWith('//')) return false;
  // further constraints could be added here (e.g., max length)
  return true;
}
module.exports = { isSafeReturnTo };
