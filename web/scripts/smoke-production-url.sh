#!/usr/bin/env bash
# Manual / release smoke against the live host (default oceanflows.net).
set -euo pipefail

HOST="${1:-oceanflows.net}"
BASE_HTTP="http://${HOST}"
BASE_HTTPS="https://${HOST}"

fail() {
  echo "smoke-production-url: $*" >&2
  exit 1
}

echo "Checking HTTPS ${BASE_HTTPS}/ ..."
code="$(curl -sS -o /tmp/smoke-home.html -w '%{http_code}' "${BASE_HTTPS}/")"
[[ "${code}" == "200" ]] || fail "HTTPS home returned ${code}"

if grep -qE '\[[A-Z][A-Z0-9_]+\]' /tmp/smoke-home.html; then
  fail "bracket placeholders found on home HTML (BR-09)"
fi

if ! grep -q 'static.cloudflareinsights.com/beacon.min.js' /tmp/smoke-home.html; then
  echo "WARN: Cloudflare Web Analytics beacon not in home HTML (FR-14 / PUBLIC_CF_ANALYTICS_TOKEN)"
fi

echo "Checking HTTP → HTTPS for ${BASE_HTTP}/ ..."
redir="$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' "${BASE_HTTP}/")"
read -r http_code redirect_url <<<"${redir}"
if [[ "${http_code}" == "301" || "${http_code}" == "302" || "${http_code}" == "307" || "${http_code}" == "308" ]]; then
  if [[ "${redirect_url}" != https://* ]]; then
    fail "HTTP redirect target is not HTTPS: ${redirect_url}"
  fi
  echo "HTTP redirects to ${redirect_url}"
elif [[ "${http_code}" == "200" ]]; then
  echo "WARN: HTTP serves 200 without redirect (NFR-06 — enable Always Use HTTPS on zone)"
else
  fail "HTTP apex returned ${http_code}"
fi

echo "smoke-production-url: done"