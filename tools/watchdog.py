#!/usr/bin/env python3
"""
watchdog.py — answer the only question that matters: is anything actually going to publish?

A routine's SUCCEEDED status means the session exited cleanly, not that a video shipped. Thirteen
consecutive daily batches (2026-08-14 .. 2026-08-26) reported SUCCEEDED while producing nothing,
and the channel was dark for 14 days before anyone noticed. Status is not evidence. The channel is.

This asks YouTube directly how many videos are queued to publish in the next window, and fails
loudly when the answer is zero. Cheap enough to run on its own schedule, after the daily batch.

Usage (from the repo root, after bootstrap):
    ./venv/bin/python tools/watchdog.py                  # look 24h ahead, need >= 1
    ./venv/bin/python tools/watchdog.py --hours 12 --min 1
    ./venv/bin/python tools/watchdog.py --quiet          # print only on failure

Exit 0 = queue is healthy. Exit 1 = nothing is scheduled; the channel is about to go dark.
"""
import argparse
import datetime as dt
import importlib.util
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def yt_service():
    spec = importlib.util.spec_from_file_location("ytu", REPO / "tools" / "yt_upload.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.service()


def main() -> int:
    ap = argparse.ArgumentParser(description="Fail if nothing is queued to publish.")
    ap.add_argument("--hours", type=int, default=24, help="look this far ahead (default 24)")
    ap.add_argument("--min", type=int, default=1, dest="minimum",
                    help="minimum videos required in the window (default 1)")
    ap.add_argument("--quiet", action="store_true", help="print only when the check fails")
    args = ap.parse_args()

    yt = yt_service()
    channels = yt.channels().list(part="contentDetails,snippet", mine=True).execute()
    if not channels.get("items"):
        print("WATCHDOG FAIL: this token has no channel", file=sys.stderr)
        return 1
    channel = channels["items"][0]
    uploads = channel["contentDetails"]["relatedPlaylists"]["uploads"]

    ids, page = [], None
    while True:
        batch = yt.playlistItems().list(
            part="contentDetails", playlistId=uploads, maxResults=50, pageToken=page
        ).execute()
        ids += [i["contentDetails"]["videoId"] for i in batch["items"]]
        page = batch.get("nextPageToken")
        if not page:
            break

    now = dt.datetime.now(dt.timezone.utc)
    horizon = now + dt.timedelta(hours=args.hours)
    queued, latest = [], None
    for start in range(0, len(ids), 50):
        chunk = yt.videos().list(part="snippet,status", id=",".join(ids[start:start + 50])).execute()
        for item in chunk["items"]:
            snip, stat = item["snippet"], item["status"]
            when = stat.get("publishAt") or snip["publishedAt"]
            at = dt.datetime.fromisoformat(when.replace("Z", "+00:00"))
            latest = max(latest, at) if latest else at
            if now <= at <= horizon:
                queued.append((at, item["id"], snip["title"], stat.get("privacyStatus")))

    queued.sort()
    healthy = len(queued) >= args.minimum

    if healthy and args.quiet:
        return 0

    print(f"channel  : {channel['snippet']['title']}")
    print(f"now      : {now:%Y-%m-%d %H:%M}Z")
    print(f"window   : next {args.hours}h (need >= {args.minimum})")
    print(f"queued   : {len(queued)}")
    for at, vid, title, privacy in queued:
        hrs = (at - now).total_seconds() / 3600
        print(f"  {at:%Y-%m-%d %H:%M}Z  (in {hrs:4.1f}h)  {privacy:8} {vid}  {title[:58]}")

    if healthy:
        print("WATCHDOG OK")
        return 0

    dark = (now - latest).days if latest and latest < now else 0
    print("")
    print(f"WATCHDOG FAIL: nothing publishes in the next {args.hours}h.", file=sys.stderr)
    if latest:
        print(f"  last/next known slot: {latest:%Y-%m-%d %H:%M}Z"
              + (f" — the channel has been dark {dark} day(s)" if dark else ""), file=sys.stderr)
    print("  The daily batch did not produce. Do NOT trust the routine's SUCCEEDED status —", file=sys.stderr)
    print("  read the run log for a 'Blocked by classifier' denial or a bootstrap CRITICAL.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
