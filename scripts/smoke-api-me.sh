#!/usr/bin/env bash
set -euo pipefail
BASE_URL=${BASE_URL:-http://localhost:3000}
echo "BASE_URL=$BASE_URL"

command -v curl >/dev/null || { echo "curl is required"; exit 2; }

# Fetch /api/me
resp=$(curl -s -w "\n%{http_code}" -H "Accept: application/json" "$BASE_URL/api/me" || true)
body=$(printf "%s" "$resp" | sed '$d')
code=$(printf "%s" "$resp" | tail -n1)

echo "/api/me HTTP status: $code"
if [ "$code" != "200" ]; then
  echo "FAIL: /api/me did not return 200"
  echo "Body:\n$body"
  exit 3
fi

# Basic JSON checks (no jq dependency) — ensure 'scopes' or 'user' appear
if printf "%s" "$body" | grep -q '"scopes"' || printf "%s" "$body" | grep -q '"user"'; then
  echo "/api/me looks like JSON with scopes/user"
else
  echo "WARN: /api/me response did not contain 'scopes' or 'user' keys"
fi

# Check /auth/google exists (allow 200 or 302)
code=$(curl -s -o /dev/null -w "%{http_code}" -I "$BASE_URL/auth/google" || true)
echo "/auth/google HTTP status: $code"
if [ "$code" != "200" ] && [ "$code" != "302" ] && [ "$code" != "303" ]; then
  echo "FAIL: /auth/google did not return 200/302/303"
  exit 4
fi

# Check POST /auth/logout exists (accept 200/302/303)
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/logout" || true)
echo "/auth/logout (POST) HTTP status: $code"
if [ "$code" != "200" ] && [ "$code" != "302" ] && [ "$code" != "303" ]; then
  echo "FAIL: POST /auth/logout did not return 200/302/303"
  exit 5
fi

echo "SMOKE OK: api/me + auth endpoints are present"
exit 0
