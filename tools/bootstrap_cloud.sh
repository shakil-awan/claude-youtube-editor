#!/usr/bin/env bash
# bootstrap_cloud.sh — make a FRESH cloud container ready to run the ToolMint pipeline.
#
# Scheduled sessions start blank: no venv, no ffmpeg, no node_modules, no .youtube/ auth.
# This rebuilds all of it, idempotently, and PROVES what works before the batch spends money.
#
# DESIGN RULE (learned the hard way 2026-08-10): this script must never abort the whole run
# over one non-critical step. An earlier version ran under `set -e`, so a single failure in
# step 1 killed bootstrap and the batch reported "did NOT run — nothing downstream attempted".
# Now every check runs, failures are COLLECTED, and the script exits non-zero only if
# something genuinely blocks production. The summary tells you exactly which secret is at fault.
#
# Env secrets used (set them in the cloud environment, never in git):
#   YT_CLIENT_SECRET_B64 + YT_TOKEN_B64   YouTube upload auth  (CRITICAL — no upload without it)
#   ELEVENLABS_API_KEY                    narration            (CRITICAL — no video without it)
#   REPLICATE_API_KEY                     FLUX art             (optional — falls back to Gemini)
#   GEMINI_API_KEY                        Gemini art fallback  (optional)
#   GH_PAT                                git push             (optional — patch fallback exists)
set -uo pipefail          # NOT -e: we want every check to run
cd "$(dirname "$0")/.."

CRITICAL=()               # blocks production
DEGRADED=()               # works, but with reduced capability
say() { printf '%s\n' "$1"; }
# A key counts as present if it is in the environment OR in .env — the python tools read both,
# so the checks must too (otherwise bootstrap blocks a run that would actually have worked).
have() { [ -n "${!1:-}" ] || grep -q "^$1=." .env 2>/dev/null; }

say "== ToolMint cloud bootstrap =="

# ---------------------------------------------------------------- 1. YouTube auth
say "-- [1/6] YouTube auth"
if python3 tools/restore_youtube_auth.py 2>&1 | sed 's/^/    /'; then
  :
elif [ -f .youtube/token.json ]; then
  say "    env secrets absent, but .youtube/ files are already on disk — continuing"
else
  CRITICAL+=("YouTube auth: set YT_CLIENT_SECRET_B64 and YT_TOKEN_B64 in this environment (tools/restore_youtube_auth.py --export prints them on the authed machine)")
fi

# ---------------------------------------------------------------- 2. narration key
say "-- [2/6] ElevenLabs key"
if have ELEVENLABS_API_KEY; then
  say "    present"
else
  CRITICAL+=("ELEVENLABS_API_KEY missing — no narration can be generated")
fi

# ---------------------------------------------------------------- 3. image backends
say "-- [3/6] image backends"
if have REPLICATE_API_KEY || have REPLICATE_API_TOKEN; then
  say "    FLUX via Replicate: available (default backend)"
elif have GEMINI_API_KEY; then
  DEGRADED+=("REPLICATE_API_KEY missing — art falls back to Gemini (~11x the cost per image)")
else
  CRITICAL+=("no image backend: set REPLICATE_API_KEY (preferred) or GEMINI_API_KEY — cover frames and thumbnails need one")
fi

# ---------------------------------------------------------------- 4. git push
say "-- [4/6] git push credential"
if [ -n "${GH_PAT:-}" ]; then
  git remote set-url origin "https://x-access-token:${GH_PAT}@github.com/shakil-awan/claude-youtube-editor.git" 2>/dev/null
  git config user.name "ToolMint Automation" 2>/dev/null
  git config user.email "toolmint-automation@users.noreply.github.com" 2>/dev/null
  if git push --dry-run origin HEAD:main >/dev/null 2>&1; then
    say "    ENABLED (dry-run OK)"
  else
    DEGRADED+=("GH_PAT is set but the push dry-run FAILED — the token likely lacks 'Contents: Read and write' on this repo, or is expired. The batch must use its format-patch fallback.")
  fi
else
  DEGRADED+=("GH_PAT not set — the batch cannot push and must use its format-patch fallback (this also breaks ledger dedup)")
fi

# ---------------------------------------------------------------- 5. toolchain
say "-- [5/6] toolchain"
[ -d venv ] || python3 -m venv venv 2>&1 | sed 's/^/    /'
./venv/bin/pip -q install --upgrade pip >/dev/null 2>&1
./venv/bin/pip -q install google-api-python-client google-auth google-auth-oauthlib \
                          google-auth-httplib2 google-genai pillow >/dev/null 2>&1 \
  && say "    python deps OK" || CRITICAL+=("pip install failed — python tooling unavailable")

command -v ffmpeg >/dev/null 2>&1 || { apt-get update -qq >/dev/null 2>&1; apt-get install -y -qq ffmpeg >/dev/null 2>&1; }
command -v ffmpeg >/dev/null 2>&1 && say "    ffmpeg $(ffmpeg -version | head -1 | cut -d' ' -f3)" \
  || CRITICAL+=("ffmpeg unavailable — cannot mux audio")

if [ -d remotion/node_modules ]; then
  say "    remotion deps present"
else
  say "    installing remotion deps (slow, one time)…"
  (cd remotion && npm install --no-audit --no-fund >/dev/null 2>&1) \
    && say "    remotion deps OK" || CRITICAL+=("npm install failed — cannot render video")
fi

HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)
if [ -n "$HS" ]; then
  say "    HEADLESS_SHELL=$HS"
else
  CRITICAL+=("no headless shell found under /opt/pw-browsers — Remotion cannot render")
fi

# ---------------------------------------------------------------- 6. channel identity
say "-- [6/6] channel identity"
CH=$(./venv/bin/python tools/yt_upload.py whoami 2>&1 | tail -1)
if [ "$CH" = "ToolMint" ]; then
  say "    channel: ToolMint ✓"
else
  CRITICAL+=("whoami returned '$CH' instead of ToolMint — wrong or missing YouTube token")
fi

# ---------------------------------------------------------------- summary
say ""
say "== bootstrap summary =="
if [ ${#DEGRADED[@]} -gt 0 ]; then
  say "DEGRADED (run continues):"
  for d in "${DEGRADED[@]}"; do say "  ! $d"; done
fi
if [ ${#CRITICAL[@]} -gt 0 ]; then
  say "CRITICAL (production blocked):"
  for c in "${CRITICAL[@]}"; do say "  x $c"; done
  say "== bootstrap FAILED =="
  exit 1
fi
say "== bootstrap OK =="
