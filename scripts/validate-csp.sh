#!/usr/bin/env bash
set -euo pipefail

FILE=server.js
if [ ! -f "$FILE" ]; then
  echo "Missing $FILE"
  exit 2
fi

# Look for setHeader('Content-Security-Policy', or setHeader("Content-Security-Policy",
if rg "setHeader\s*\(\s*['\"]Content-Security-Policy['\"]\s*," "$FILE" >/dev/null; then
  echo "OK: Content-Security-Policy header is set with quoted header name"
  exit 0
fi

echo "FAIL: Content-Security-Policy header not found or header name not quoted in $FILE"
exit 1
