#!/usr/bin/env python3
"""
watchdog.py — answer the only question that matters: is anything actually going to publish?

A routine's SUCCEEDED status means the session exited cleanly, not that a video shipped. Thirteen
consecutive daily batches (2026-08-14 .. 2026-08-26) reported SUCCEEDED while producing nothing,
and the channel was dark 14 days before anyone noticed. Status is not evidence. The channel is.

This asks YouTube directly how many videos are queued to publish in the next window, and fails
loudly when the answer is zero.

STDLIB ONLY, BY DESIGN. No venv, no google-api-python-client, no pip step — so this can run as a
cheap standalone check (a few seconds) on its own schedule, independent of the batch. If the
batch dies at bootstrap, the batch's own self-check dies with it; this one still runs.

Credentials: .youtube/token.json if present, else the YT_TOKEN_B64 environment secret. Values are
never printed.

Usage:
    python3 tools/watchdog.py                  # look 24h ahead, need >= 1
    python3 tools/watchdog.py --hours 12 --min 1
    python3 tools/watchdog.py --quiet          # print only on failure

Exit 0 = queue is healthy. Exit 1 = nothing is scheduled; the channel is about to go dark.
"""
import argparse
import base64
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
API = "https://www.googleapis.com/youtube/v3/"


def load_token() -> dict:
    """OAuth material from disk, else from the environment secret. Never printed."""
    on_disk = REPO / ".youtube" / "token.json"
    if on_disk.exists():
        return json.loads(on_disk.read_text(encoding="utf-8"))
    raw = os.environ.get("YT_TOKEN_B64", "").strip()
    if not raw:
        sys.exit("WATCHDOG FAIL: no .youtube/token.json and no YT_TOKEN_B64 — cannot check the channel")
    try:
        return json.loads(base64.b64decode(raw))
    except Exception as exc:                          # noqa: BLE001 - surface the shape, not the value
        sys.exit(f"WATCHDOG FAIL: YT_TOKEN_B64 is not valid base64 JSON ({type(exc).__name__})")


def access_token(token: dict) -> str:
    """Exchange the refresh token for a fresh access token."""
    body = urllib.parse.urlencode({
        "client_id": token["client_id"],
        "client_secret": token["client_secret"],
        "refresh_token": token["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    url = token.get("token_uri", "https://oauth2.googleapis.com/token")
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=body), timeout=30) as resp:
            return json.load(resp)["access_token"]
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode()[:300]
        # invalid_grant here means the refresh token really is dead (revoked, or a "Testing"-status
        # OAuth client's 7-day expiry). That is a genuine auth failure — say so precisely.
        sys.exit(f"WATCHDOG FAIL: token refresh rejected (HTTP {exc.code}): {detail}")


def api(token: str, path: str, **params) -> dict:
    url = API + path + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def main() -> int:
    ap = argparse.ArgumentParser(description="Fail if nothing is queued to publish.")
    ap.add_argument("--hours", type=int, default=24, help="look this far ahead (default 24)")
    ap.add_argument("--min", type=int, default=1, dest="minimum",
                    help="minimum videos required in the window (default 1)")
    ap.add_argument("--quiet", action="store_true", help="print only when the check fails")
    args = ap.parse_args()

    at = access_token(load_token())

    channels = api(at, "channels", part="contentDetails,snippet", mine="true")
    if not channels.get("items"):
        print("WATCHDOG FAIL: this token has no channel", file=sys.stderr)
        return 1
    channel = channels["items"][0]
    uploads = channel["contentDetails"]["relatedPlaylists"]["uploads"]

    ids, page = [], None
    while True:
        extra = {"pageToken": page} if page else {}
        batch = api(at, "playlistItems", part="contentDetails", playlistId=uploads,
                    maxResults=50, **extra)
        ids += [i["contentDetails"]["videoId"] for i in batch["items"]]
        page = batch.get("nextPageToken")
        if not page:
            break

    now = dt.datetime.now(dt.timezone.utc)
    horizon = now + dt.timedelta(hours=args.hours)
    queued, latest = [], None
    for start in range(0, len(ids), 50):
        chunk = api(at, "videos", part="snippet,status", id=",".join(ids[start:start + 50]))
        for item in chunk["items"]:
            snip, stat = item["snippet"], item["status"]
            when = stat.get("publishAt") or snip["publishedAt"]
            slot = dt.datetime.fromisoformat(when.replace("Z", "+00:00"))
            latest = max(latest, slot) if latest else slot
            if now <= slot <= horizon:
                queued.append((slot, item["id"], snip["title"], stat.get("privacyStatus", "?")))

    queued.sort()
    healthy = len(queued) >= args.minimum
    if healthy and args.quiet:
        return 0

    print(f"channel  : {channel['snippet']['title']}")
    print(f"now      : {now:%Y-%m-%d %H:%M}Z")
    print(f"window   : next {args.hours}h (need >= {args.minimum})")
    print(f"queued   : {len(queued)}")
    for slot, vid, title, privacy in queued:
        hrs = (slot - now).total_seconds() / 3600
        print(f"  {slot:%Y-%m-%d %H:%M}Z  (in {hrs:4.1f}h)  {privacy:8} {vid}  {title[:58]}")

    if healthy:
        print("WATCHDOG OK")
        return 0

    print("")
    sys.stdout.flush()          # keep the report above the alarm when both go to a terminal
    shortfall = (f"only {len(queued)} queued, need {args.minimum}"
                 if queued else "nothing queued")
    print(f"WATCHDOG FAIL: {shortfall} in the next {args.hours}h.", file=sys.stderr)
    if latest:
        dark = (now - latest).days
        print(f"  latest known slot: {latest:%Y-%m-%d %H:%M}Z"
              + (f" — the channel has been dark {dark} day(s)" if dark > 0 else ""), file=sys.stderr)
    print("  The daily batch did not produce. Do NOT trust the routine's SUCCEEDED status —",
          file=sys.stderr)
    print("  read the run log for a 'Blocked by classifier' denial or a bootstrap CRITICAL.",
          file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
