#!/usr/bin/env python3
"""
next_slot.py — pick the next free publish slot(s) for a Short.

NICHE-STRATEGY.md §4 publishes at fixed local times (default 11:00 & 17:00 America/New_York).
This tool turns that policy into a concrete RFC3339 UTC timestamp for publish.json's
"publishAt": it scans every videos/*/publish.json for slots already claimed and returns the
next free one(s), always at least --lead minutes in the future (YouTube rejects a publishAt
in the past; give the upload time to finish processing too).

Usage (from the repo root):
  python tools/next_slot.py                # next 1 free slot
  python tools/next_slot.py -n 3           # next 3 free slots (for a batch)
  python tools/next_slot.py --slots 11:00,17:00 --tz America/New_York --lead 45

Output: one RFC3339 UTC timestamp per line (e.g. 2026-08-08T15:00:00Z) — paste into
publish.json "publishAt" (privacy must stay "private"; YouTube flips it public at that time).
DST is handled by the IANA timezone. Stdlib only (zoneinfo).
"""
import argparse
import glob
import json
import os
import sys
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo


def claimed_slots():
    """Every publishAt already promised by any project's publish.json (UTC datetimes)."""
    taken = set()
    for p in glob.glob(os.path.join("videos", "*", "publish.json")):
        try:
            plan = json.load(open(p, encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        at = plan.get("publishAt")
        if not at:
            continue
        try:
            dt = datetime.fromisoformat(at.replace("Z", "+00:00"))
            taken.add(dt.astimezone(timezone.utc).replace(microsecond=0))
        except ValueError:
            print(f"warning: unparsable publishAt in {p}: {at!r}", file=sys.stderr)
    return taken


def main():
    ap = argparse.ArgumentParser(description="Next free publish slot(s), RFC3339 UTC.")
    ap.add_argument("-n", type=int, default=1, help="how many slots (default 1)")
    ap.add_argument("--slots", default="11:00,17:00", help="local slot times, comma-separated (default 11:00,17:00)")
    ap.add_argument("--tz", default="America/New_York", help="IANA timezone of the slots")
    ap.add_argument("--lead", type=int, default=45, help="minimum minutes from now (default 45)")
    args = ap.parse_args()

    try:
        tz = ZoneInfo(args.tz)
    except KeyError:
        sys.exit(f"unknown timezone: {args.tz}")
    try:
        slot_times = sorted(time(*map(int, s.strip().split(":"))) for s in args.slots.split(","))
    except (ValueError, TypeError):
        sys.exit(f"bad --slots value: {args.slots!r} (expected e.g. 11:00,17:00)")

    taken = claimed_slots()
    earliest = datetime.now(timezone.utc) + timedelta(minutes=args.lead)

    out, day = [], datetime.now(tz).date()
    while len(out) < args.n:
        for st in slot_times:
            local = datetime.combine(day, st, tzinfo=tz)
            utc = local.astimezone(timezone.utc).replace(microsecond=0)
            if utc >= earliest and utc not in taken and len(out) < args.n:
                out.append(utc)
        day += timedelta(days=1)

    for dt in out:
        print(dt.strftime("%Y-%m-%dT%H:%M:%SZ"))


if __name__ == "__main__":
    main()
