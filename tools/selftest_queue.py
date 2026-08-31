#!/usr/bin/env python3
"""
selftest_queue.py — prove the publish-queue logic before it decides a day's production.

next_slot.py and watchdog.py are the two tools that decide HOW MANY Shorts get made and whether
anyone is told when the answer was wrong. Both are hard to test against the live channel (you
cannot conjure a half-empty queue on demand), and both failed silently for days when they were
wrong: the queue averaged one video a day against a 2/day policy and every check said OK.

So they are tested here against a synthetic queue, with no network and no credentials. Run it
after touching either tool:

    python3 tools/selftest_queue.py        # exit 0 = the queue logic is sound

Stdlib only, like the tools it covers.
"""
import contextlib
import datetime as dt
import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import next_slot                                      # noqa: E402
import watchdog                                       # noqa: E402
import ytqueue                                        # noqa: E402

NOW = dt.datetime.now(dt.timezone.utc)
TODAY = NOW.date()
failures: list[str] = []


def slot(day_offset: int, hour: int) -> dt.datetime:
    """A UTC publish slot `day_offset` days out (15:00Z / 21:00Z = the 11:00/17:00 ET slots)."""
    return dt.datetime.combine(TODAY + dt.timedelta(days=day_offset),
                               dt.time(hour, 0), tzinfo=dt.timezone.utc)


def stamp(when: dt.datetime) -> str:
    return when.strftime("%Y-%m-%dT%H:%M:%SZ")


def check(name: str, got, want) -> None:
    if got == want:
        print(f"[PASS] {name}")
    else:
        failures.append(name)
        print(f"[FAIL] {name}\n   got : {got}\n   want: {want}")


def fake_channel(slots) -> None:
    """Point both tools at a synthetic queue instead of YouTube."""
    videos = [{"slot": s, "id": f"vid{i}", "title": "synthetic", "privacy": "private"}
              for i, s in enumerate(sorted(slots))]
    for module in (ytqueue, next_slot.ytqueue, watchdog.ytqueue):
        module.channel_videos = lambda videos=videos: ("ToolMint", list(videos))
        module.claimed_slots = lambda videos=videos: {v["slot"] for v in videos}


def run_next_slot(channel_slots, argv, local=frozenset()):
    fake_channel(channel_slots)
    next_slot.local_claims = lambda: set(local)
    sys.argv = ["next_slot.py", *argv]
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        next_slot.main()
    return out.getvalue().split(), err.getvalue()


def run_watchdog(channel_slots, argv):
    fake_channel(channel_slots)
    sys.argv = ["watchdog.py", *argv]
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = watchdog.main()
    return code, out.getvalue(), err.getvalue()


# ---------------------------------------------------------------- next_slot: what to produce
print("-- next_slot.py")
got, _ = run_next_slot([], ["--fill", "2"])
check("--fill 2 on an empty queue asks for two full days",
      got, [stamp(slot(0, 15)), stamp(slot(0, 21)), stamp(slot(1, 15)), stamp(slot(1, 21))])

# The regression that mattered: a batch whose push was refused leaves NOTHING in the repo, so the
# next batch must learn about those slots from the channel or it will double-book them.
got, _ = run_next_slot([slot(0, 15), slot(0, 21)], ["--fill", "2"])
check("slots filled by an unpushed batch are not offered again",
      got, [stamp(slot(1, 15)), stamp(slot(1, 21))])

got, err = run_next_slot([slot(0, 15), slot(0, 21), slot(1, 15), slot(1, 21)], ["--fill", "2"])
check("a full queue asks for nothing", got, [])
check("a full queue says why on stderr", "queue already full" in err, True)

got, _ = run_next_slot([], ["--fill", "3", "--max", "2"])
check("--max caps a catch-up run", got, [stamp(slot(0, 15)), stamp(slot(0, 21))])

got, _ = run_next_slot([], ["--fill", "1"], local={slot(0, 15)})
check("a local publish.json not yet uploaded still holds its slot", got, [stamp(slot(0, 21))])


def unavailable():
    raise ytqueue.QueueUnavailable("no token")


for module in (ytqueue, next_slot.ytqueue):
    module.claimed_slots = unavailable
next_slot.local_claims = set
sys.argv = ["next_slot.py", "--fill", "1"]
out, err = io.StringIO(), io.StringIO()
with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
    next_slot.main()
check("an unreadable channel degrades to local-only instead of shipping nothing",
      out.getvalue().split(), [stamp(slot(0, 15)), stamp(slot(0, 21))])
check("…and says so loudly", "warning: channel not readable" in err.getvalue(), True)

# ---------------------------------------------------------------- watchdog: what to alarm on
print("-- watchdog.py")
code, _, err = run_watchdog([slot(0, 15), slot(0, 21), slot(1, 15), slot(1, 21)], ["--hours", "24"])
check("a full day with a full buffer is healthy and silent", (code, "WARN" in err), (0, False))

code, _, err = run_watchdog([slot(0, 15), slot(0, 21)], ["--hours", "24"])
check("a full day with an eaten buffer passes but warns", (code, "WATCHDOG WARN" in err), (0, True))

# THE REGRESSION THIS FILE EXISTS FOR: one video is half a day, and used to report OK.
code, out, _ = run_watchdog([slot(0, 15)], ["--hours", "24"])
check("a HALF day fails", (code, "WATCHDOG OK" in out), (1, False))

code, _, _ = run_watchdog([], ["--hours", "24"])
check("an empty day fails", code, 1)

code, out, err = run_watchdog([slot(0, 15), slot(0, 21), slot(1, 15), slot(1, 21)], ["--quiet"])
check("--quiet stays silent only when everything is healthy", (code, out, err), (0, "", ""))

code, out, _ = run_watchdog([slot(0, 15), slot(0, 21)], ["--quiet"])
check("--quiet still reports an eaten buffer", (code, "SHORT" in out), (0, True))

print("")
if failures:
    print(f"SELFTEST FAILED: {len(failures)} case(s): " + "; ".join(failures))
    sys.exit(1)
print("SELFTEST OK — queue logic sound")
