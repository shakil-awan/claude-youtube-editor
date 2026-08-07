#!/usr/bin/env python3
"""
restore_youtube_auth.py — materialize .youtube/ OAuth files from environment secrets.

WHY: the YouTube OAuth flow (yt_upload.py auth) needs a browser, so it runs ONCE on the owner's
machine. Cloud/CI sessions (Claude Code on the web, a fresh VPS, GitHub Actions) have no browser
and no persistent disk — they get upload access by carrying the two auth files as environment
secrets instead. This script rebuilds .youtube/ from those secrets at session start.

One-time, on the machine where `yt_upload.py auth` succeeded (prints the values to store):
    python tools/restore_youtube_auth.py --export

Store the printed values as environment secrets (e.g. Claude Code environment settings):
    YT_CLIENT_SECRET_B64   (required)
    YT_TOKEN_B64           (required — the upload token)
    YT_TOKEN_ANALYTICS_B64 (optional — yt_stats.py's read-only token)

Then any session runs:
    python tools/restore_youtube_auth.py        # writes .youtube/*.json from the secrets

Treat these values like passwords: they grant upload rights to the channel. Store them ONLY in
a secrets manager / environment settings — never in chat, never in git (.youtube/ is ignored).
Note: google-auth refreshes access tokens in-process from the refresh token inside token.json,
so a session-start restore is enough; the stored secret only goes stale if access is revoked.
"""
import base64
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YT_DIR = os.path.join(ROOT, ".youtube")
FILES = {
    "YT_CLIENT_SECRET_B64": ("client_secret.json", True),
    "YT_TOKEN_B64": ("token.json", True),
    "YT_TOKEN_ANALYTICS_B64": ("token-analytics.json", False),
}


def load_env():
    env = {}
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return {**env, **os.environ}


def do_export():
    ok = False
    for var, (fname, required) in FILES.items():
        path = os.path.join(YT_DIR, fname)
        if os.path.exists(path):
            val = base64.b64encode(open(path, "rb").read()).decode()
            print(f"{var}={val}\n")
            ok = True
        elif required:
            print(f"# {fname} not found — run `python tools/yt_upload.py auth` first", file=sys.stderr)
    if ok:
        print("# Store these as environment secrets (never in git or chat).", file=sys.stderr)
    sys.exit(0 if ok else 1)


def do_restore():
    env = load_env()
    wrote, missing = [], []
    for var, (fname, required) in FILES.items():
        val = env.get(var)
        if not val:
            if required:
                missing.append(var)
            continue
        try:
            data = base64.b64decode(val)
        except Exception:
            sys.exit(f"{var} is not valid base64 — re-export it.")
        os.makedirs(YT_DIR, exist_ok=True)
        path = os.path.join(YT_DIR, fname)
        with open(path, "wb") as f:
            f.write(data)
        try:
            os.chmod(path, 0o600)
        except OSError:
            pass
        wrote.append(fname)
    if wrote:
        print(f"restored .youtube/: {', '.join(wrote)}")
    if missing:
        sys.exit(f"missing secrets: {', '.join(missing)} — run --export on the authed machine "
                 "and add them to this environment's secrets.")
    if not wrote:
        sys.exit("nothing to restore.")


if __name__ == "__main__":
    do_export() if "--export" in sys.argv else do_restore()
