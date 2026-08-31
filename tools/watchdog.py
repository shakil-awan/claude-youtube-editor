#!/usr/bin/env python3
"""
watchdog.py — answer the only question that matters: is the channel going to publish, on schedule,
at the rate the strategy promises?

A routine's SUCCEEDED status means the session exited cleanly, not that a video shipped. Thirteen
consecutive daily batches (2026-08-14 .. 2026-08-26) reported SUCCEEDED while producing nothing,
and the channel was dark 14 days before anyone noticed. Status is not evidence. The channel is.

COUNT, NOT PRESENCE (2026-08-31). This used to pass on `>= 1` video in the window. NICHE-STRATEGY
§4 promises 2/day, so one queued Short is a HALF-DARK day — a failure the old default reported as
"WATCHDOG OK". Between 2026-08-27 and 2026-08-30 the batch produced two Shorts on the days it ran
and nothing on the days it died, which averages to one a day; nothing ever alarmed, because on a
day with two the check passed and on a day with zero the batch had already been recorded as
SUCCEEDED. The default minimum is now 2, and the report always breaks the queue down per day so a
shrinking buffer is visible before it becomes an outage.

STDLIB ONLY, BY DESIGN. No venv, no google-api-python-client, no pip step — so this can run as a
cheap standalone check (a few seconds) on its own schedule, independent of the batch. If the
batch dies at bootstrap, the batch's own self-check dies with it; this one still runs.

Credentials (via tools/ytqueue.py): .youtube/token.json if present, else the YT_TOKEN_B64
environment secret. Values are never printed.

Usage:
    python3 tools/watchdog.py                  # look 24h ahead, need >= 2 (one full day)
    python3 tools/watchdog.py --hours 12 --min 1
    python3 tools/watchdog.py --buffer-days 2  # also WARN if the next 2 days are not full
    python3 tools/watchdog.py --quiet          # print only on failure

Exit 0 = the hard window is covered. Exit 1 = the channel is about to go dark or half-dark.
A buffer warning never changes the exit code — it is early warning, not an alarm.
"""
import argparse
import datetime as dt
import sys
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ytqueue                                        # noqa: E402 - stdlib-only sibling module

PER_DAY_TARGET = 2                                    # NICHE-STRATEGY.md §4: 2/day sustained
PUBLISH_TZ = "America/New_York"                       # §4 publishes on this clock, so days are counted on it


def main() -> int:
    ap = argparse.ArgumentParser(description="Fail if the publish queue is short.")
    ap.add_argument("--hours", type=int, default=24, help="hard window, in hours (default 24)")
    ap.add_argument("--min", type=int, default=PER_DAY_TARGET, dest="minimum",
                    help=f"minimum videos required in the window (default {PER_DAY_TARGET} — "
                         f"the strategy's daily rate)")
    ap.add_argument("--buffer-days", type=int, default=2,
                    help="also report the next N days and WARN on any that is short (default 2)")
    ap.add_argument("--day-tz", default=PUBLISH_TZ,
                    help=f"IANA timezone whose calendar days the buffer is counted in "
                         f"(default {PUBLISH_TZ} — the publish clock, so a 17:00 ET slot is never "
                         f"counted against the following day)")
    ap.add_argument("--quiet", action="store_true", help="print only when the check fails")
    args = ap.parse_args()

    try:
        day_tz = ZoneInfo(args.day_tz)
    except KeyError:
        sys.exit(f"unknown timezone: {args.day_tz}")

    try:
        channel, videos = ytqueue.channel_videos()
    except ytqueue.QueueUnavailable as exc:
        print(f"WATCHDOG FAIL: {exc}", file=sys.stderr)
        return 1

    now = dt.datetime.now(dt.timezone.utc)
    horizon = now + dt.timedelta(hours=args.hours)
    upcoming = [v for v in videos if v["slot"] >= now]
    queued = [v for v in upcoming if v["slot"] <= horizon]
    latest = videos[-1]["slot"] if videos else None

    # Days ahead that the buffer is supposed to cover, whether or not anything is queued in them,
    # counted on the publish clock rather than UTC.
    today = now.astimezone(day_tz).date()
    days = {str(today + dt.timedelta(days=d)): [] for d in range(max(args.buffer_days, 1))}
    for v in upcoming:
        key = str(v["slot"].astimezone(day_tz).date())
        if key in days:
            days[key].append(v)
    short_days = [d for d, vs in days.items() if len(vs) < PER_DAY_TARGET]

    healthy = len(queued) >= args.minimum
    if healthy and not short_days and args.quiet:
        return 0

    print(f"channel  : {channel}")
    print(f"now      : {now:%Y-%m-%d %H:%M}Z")
    print(f"window   : next {args.hours}h (need >= {args.minimum})")
    print(f"queued   : {len(queued)}")
    for v in queued:
        hrs = (v["slot"] - now).total_seconds() / 3600
        print(f"  {v['slot']:%Y-%m-%d %H:%M}Z  (in {hrs:4.1f}h)  {v['privacy']:8} {v['id']}  {v['title'][:58]}")

    print(f"buffer   : next {max(args.buffer_days, 1)} day(s) on the {args.day_tz} clock, "
          f"target {PER_DAY_TARGET}/day")
    for day in sorted(days):
        vs = days[day]
        mark = "ok  " if len(vs) >= PER_DAY_TARGET else "SHORT"
        print(f"  {day}  {len(vs)}/{PER_DAY_TARGET}  {mark}  "
              + ", ".join(f"{v['slot']:%H:%M}Z" for v in sorted(vs, key=lambda x: x["slot"])))


    if healthy:
        print("WATCHDOG OK")
        if short_days:
            # Not a failure: today is covered. But the buffer the daily batch is supposed to keep
            # has been eaten, so the next dead batch WILL go dark. Say it while it is still cheap.
            print(f"WATCHDOG WARN: {len(short_days)} of the next {max(args.buffer_days, 1)} day(s) "
                  f"below {PER_DAY_TARGET}/day ({', '.join(sorted(short_days))}). "
                  f"The next batch should top up with `tools/next_slot.py --fill "
                  f"{max(args.buffer_days, 1)}`.", file=sys.stderr)
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
    print("  The daily batch did not produce its full day. Do NOT trust the routine's SUCCEEDED",
          file=sys.stderr)
    print("  status — read the run log for a 'Blocked by classifier' denial, a pending permission",
          file=sys.stderr)
    print("  request the session waited on forever, or a bootstrap CRITICAL.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
