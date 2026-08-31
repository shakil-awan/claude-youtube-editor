#!/usr/bin/env python3
"""
next_slot.py — pick the publish slot(s) a batch should fill next.

NICHE-STRATEGY.md §4 publishes 2/day at fixed local times (default 11:00 & 17:00
America/New_York). This tool turns that policy into concrete RFC3339 UTC timestamps for
publish.json's "publishAt".

TWO MODES
---------
  --fill N   (what the daily batch uses)  every free slot between now and the end of day
             today+N-1. This is a TOP-UP, not a fixed count: it is how a batch that failed
             yesterday gets repaired today, and how a one-day buffer survives tomorrow's batch
             dying. With --fill 2 the steady state is 2 Shorts a day with the next day already
             in the queue, so a single dead batch no longer costs the channel a day.
  -n K       exactly K free slots (the old behaviour; still used for one-offs).

WHICH SLOTS COUNT AS TAKEN (2026-08-31)
---------------------------------------
Both of these, unioned:
  * the channel itself (tools/ytqueue.py) — authoritative, and the only source a failed push
    cannot make stale;
  * local videos/*/publish.json — covers a Short produced in this session but not yet uploaded.
Before this, only the local files were consulted. A cloud batch clones main; every batch whose
push was refused left its publish.json behind on someone else's disk, so the next batch believed
an occupied slot was free and could double-book it.

If the channel cannot be read, that is a WARNING on stderr, not a failure: the tool falls back to
the local files and keeps going, because a batch that cannot pick a slot ships nothing at all.

Usage (from the repo root):
  python tools/next_slot.py                        # next 1 free slot
  python tools/next_slot.py --fill 2               # every free slot in today + tomorrow
  python tools/next_slot.py --fill 2 --max 4       # …capped (cost control)
  python tools/next_slot.py -n 3 --no-channel      # local files only (offline)
  python tools/next_slot.py --slots 11:00,17:00 --tz America/New_York --lead 45

Output: one RFC3339 UTC timestamp per line (e.g. 2026-08-08T15:00:00Z) — paste into
publish.json "publishAt" (privacy must stay "private"; YouTube flips it public at that time).
No output means the queue is already full for the window — that is a success, not an error.
DST is handled by the IANA timezone. Stdlib only (zoneinfo).
"""
import argparse
import glob
import json
import os
import sys
from datetime import datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ytqueue                                        # noqa: E402 - stdlib-only sibling module

MAX_HORIZON_DAYS = 30                                 # a guard so a bad --fill cannot spin forever


def local_claims() -> set[datetime]:
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


def channel_claims() -> set[datetime]:
    """Slots the channel already holds. A warning, never a crash, when it cannot be read."""
    try:
        return ytqueue.claimed_slots()
    except ytqueue.QueueUnavailable as exc:
        print(f"warning: channel not readable ({exc}) — falling back to local publish.json only. "
              f"A slot filled by a batch that could not push may be double-booked.", file=sys.stderr)
        return set()
    except Exception as exc:                          # noqa: BLE001 - never block production on this
        print(f"warning: channel lookup failed ({type(exc).__name__}: {exc}) — "
              f"falling back to local publish.json only.", file=sys.stderr)
        return set()


def free_slots(slot_times, tz, taken, earliest, *, limit=None, through=None):
    """Free slots in chronological order, stopping at `limit` of them or at `through` (a date)."""
    out, day = [], datetime.now(tz).date()
    horizon = through or (day + timedelta(days=MAX_HORIZON_DAYS))
    while day <= horizon and (limit is None or len(out) < limit):
        for st in slot_times:
            local = datetime.combine(day, st, tzinfo=tz)
            utc = local.astimezone(timezone.utc).replace(microsecond=0)
            if utc >= earliest and utc not in taken and (limit is None or len(out) < limit):
                out.append(utc)
        day += timedelta(days=1)
    return out


def main():
    ap = argparse.ArgumentParser(description="Free publish slot(s), RFC3339 UTC.")
    ap.add_argument("-n", type=int, default=1, help="how many slots (default 1)")
    ap.add_argument("--fill", type=int, metavar="DAYS",
                    help="top-up mode: every free slot through the end of day today+DAYS-1 "
                         "(--fill 2 = today and tomorrow). Overrides -n.")
    ap.add_argument("--max", type=int, default=None,
                    help="cap the number of slots printed in --fill mode (cost control)")
    ap.add_argument("--slots", default="11:00,17:00", help="local slot times, comma-separated (default 11:00,17:00)")
    ap.add_argument("--tz", default="America/New_York", help="IANA timezone of the slots")
    ap.add_argument("--lead", type=int, default=45, help="minimum minutes from now (default 45)")
    ap.add_argument("--no-channel", action="store_true",
                    help="do not consult YouTube; use local publish.json only")
    args = ap.parse_args()

    try:
        tz = ZoneInfo(args.tz)
    except KeyError:
        sys.exit(f"unknown timezone: {args.tz}")
    try:
        slot_times = sorted(time(*map(int, s.strip().split(":"))) for s in args.slots.split(","))
    except (ValueError, TypeError):
        sys.exit(f"bad --slots value: {args.slots!r} (expected e.g. 11:00,17:00)")
    if args.fill is not None and args.fill < 1:
        sys.exit("--fill must be at least 1 day")

    taken = local_claims() | (set() if args.no_channel else channel_claims())
    earliest = datetime.now(timezone.utc) + timedelta(minutes=args.lead)

    if args.fill is not None:
        through = datetime.now(tz).date() + timedelta(days=min(args.fill, MAX_HORIZON_DAYS) - 1)
        slots = free_slots(slot_times, tz, taken, earliest, limit=args.max, through=through)
        if not slots:
            print(f"queue already full through {through} — nothing to produce", file=sys.stderr)
    else:
        slots = free_slots(slot_times, tz, taken, earliest, limit=args.n)

    for dt in slots:
        print(dt.strftime("%Y-%m-%dT%H:%M:%SZ"))


if __name__ == "__main__":
    main()
