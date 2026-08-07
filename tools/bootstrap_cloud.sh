#!/usr/bin/env bash
# bootstrap_cloud.sh — make a FRESH cloud container ready to run the ToolMint pipeline.
# Scheduled sessions start from a blank container: no venv, no ffmpeg, no node_modules,
# no .youtube/ auth. This script rebuilds all of it, idempotently, and proves channel
# access at the end. Requires the environment secrets: ELEVENLABS_API_KEY,
# YT_CLIENT_SECRET_B64, YT_TOKEN_B64 (see tools/restore_youtube_auth.py --export).
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== ToolMint cloud bootstrap =="

echo "-- [1/5] YouTube auth from env secrets"
if [ -f .youtube/token.json ]; then
  python3 tools/restore_youtube_auth.py || echo "(env secrets missing — using the .youtube/ files already present)"
else
  python3 tools/restore_youtube_auth.py
fi

echo "-- [2/5] python venv + deps"
[ -d venv ] || python3 -m venv venv
./venv/bin/pip -q install --upgrade pip >/dev/null
./venv/bin/pip -q install google-api-python-client google-auth google-auth-oauthlib google-auth-httplib2 >/dev/null

echo "-- [3/5] ffmpeg"
if ! command -v ffmpeg >/dev/null; then
  apt-get update -qq >/dev/null && apt-get install -y -qq ffmpeg >/dev/null
fi
ffmpeg -version | head -1

echo "-- [4/5] remotion deps"
(cd remotion && { [ -d node_modules ] && echo "node_modules present"; } || npm install --no-audit --no-fund 2>&1 | tail -1)
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)
echo "headless shell for renders: ${HS:-NOT FOUND — pass your own --browser-executable}"

echo "-- [5/5] channel identity check"
CH=$(./venv/bin/python tools/yt_upload.py whoami)
echo "channel: $CH"
[ "$CH" = "ToolMint" ] || { echo "FAIL: expected ToolMint"; exit 1; }

echo "== bootstrap OK =="
