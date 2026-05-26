#!/bin/bash
set -e

PORT=3000

echo "Starting backend..."
node server.js &
SERVER_PID=$!

# Poll until the server responds or the process dies
until curl -sf "http://localhost:${PORT}" > /dev/null 2>&1; do
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "Backend failed to start — check the output above for errors."
    exit 1
  fi
  sleep 0.3
done

echo "Backend ready — opening http://localhost:${PORT}"
open "http://localhost:${PORT}"

# Keep running (and forward Ctrl+C to the server)
wait $SERVER_PID
