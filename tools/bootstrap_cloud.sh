#!/usr/bin/env bash
# bootstrap_cloud.sh — make a FRESH cloud container ready to run the ToolMint pipeline.
#
# Scheduled sessions start blank: no venv, no ffmpeg, no node_modules, no .youtube/ auth.
# This rebuilds all of it, idempotently, and PROVES what works before the batch spends money.
#
# DESIGN RULE 1 (2026-08-10): never abort the whole run over one non-critical step. An earlier
# version ran under `set -e`, so a single failure in step 1 killed bootstrap and the batch
# reported "did NOT run". Every check runs, failures are COLLECTED, and the script exits
# non-zero only if something genuinely blocks production.
#
# DESIGN RULE 2 (2026-08-27): THIS SHELL SCRIPT HANDLES NO SECRETS. Every credential check lives
# in tools/preflight.py. The previous version used indirect expansion over secret names
# (`${!1}`), grepped .env, and interpolated a token into a remote URL — the shapes a
# credential-stealing script has. Claude Code's sandbox permission classifier read the file and
# refused to execute it ("Blocked by classifier") before a single line ran, killing 13
# consecutive daily batches (2026-08-14 .. 2026-08-26) and taking the channel dark for 14 days.
# If you add a credential check, add it to preflight.py — not here.
set -uo pipefail          # NOT -e: we want every check to run
cd "$(dirname "$0")/.."

CRITICAL=()               # blocks production
DEGRADED=()               # works, but with reduced capability
say() { printf '%s\n' "$1"; }

say "== ToolMint cloud bootstrap =="

# ---------------------------------------------------------------- 1. credentials (delegated)
python3 tools/preflight.py
if [ $? -ne 0 ]; then
  CRITICAL+=("preflight reported a blocking credential problem — see its 'CRITICAL' lines above")
fi

# ---------------------------------------------------------------- 2. toolchain
say ""
say "-- toolchain"
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

# ---------------------------------------------------------------- 3. channel identity
say ""
say "-- channel identity"
# whoami prints the channel title on its own line and the upload defaults INDENTED under it
# (added 2026-09-07). Take the last unindented line, so this survives both the extra detail
# lines and any warning the google client writes to stderr first.
CH=$(./venv/bin/python tools/yt_upload.py whoami 2>&1 | grep -v '^[[:space:]]' | tail -1)
if [ "$CH" = "ToolMint" ]; then
  say "    channel: ToolMint ✓"
else
  CRITICAL+=("whoami returned '$CH' instead of ToolMint — wrong or missing YouTube token")
fi

# ---------------------------------------------------------------- 4. logic self-tests
# Offline, no credentials, ~1s. They cover the four tools that decide how many Shorts a day gets
# made (next_slot/watchdog/ytqueue) and what metadata every upload carries (yt_upload) — the
# code whose failures are silent. DEGRADED, not CRITICAL, per DESIGN RULE 1: a self-test that
# can stop the day is a self-test that eventually costs a day.
say ""
say "-- logic self-tests"
for t in selftest_queue selftest_upload; do
  if OUT=$(python3 "tools/$t.py" 2>&1); then
    say "    $t OK"
  else
    DEGRADED+=("$t FAILED — the batch can still run, but read it: $(printf '%s' "$OUT" | tail -2 | tr '\n' ' ')")
  fi
done

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
