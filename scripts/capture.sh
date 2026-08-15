#!/usr/bin/env bash
# Build → serve on a free port → screenshot → tear down. Kept deterministic so a
# stale server can never serve assets from a previous build.
set -euo pipefail

PORT="${PORT:-3100}"
cd "$(dirname "$0")/.."

npx next build

# Wait for the port to actually be free before binding.
if command -v fuser >/dev/null 2>&1; then fuser -k "${PORT}/tcp" 2>/dev/null || true; fi
for _ in $(seq 1 15); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORT}/" || break
  sleep 1
done

npx next start -p "$PORT" >/tmp/portfolio-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  curl -sf -o /dev/null "http://127.0.0.1:${PORT}/" && break
  sleep 1
done

node scripts/screenshot.mjs "http://127.0.0.1:${PORT}"
