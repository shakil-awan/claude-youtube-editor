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
from zoneinfo import ZoneInfo
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

# THE CLOCK IS FROZEN, AND THAT IS THE POINT (2026-09-07)
# ------------------------------------------------------
# Every fixture below is built from TODAY's two slots (11:00 / 17:00 ET). Run before ~14:15Z the
# suite passed; run after it, seven cases failed — next_slot.py had correctly stopped offering a
# slot that was less than its 45-minute lead away, and the assertions still expected it. A
# self-test whose verdict depends on the hour is worse than no self-test: it cries wolf every
# afternoon, and the one thing it is here to catch (the channel silently running at half rate)
# is exactly the kind of finding an operator learns to wave away. So both tools are pinned to
# 08:00Z on today's date — before every slot, on the same calendar day in ET — and the suite
# now returns the same verdict at any hour.
FROZEN = dt.datetime.combine(TODAY, dt.time(8, 0), tzinfo=dt.timezone.utc)


class _FrozenDatetime(dt.datetime):
    """dt.datetime with now() pinned to FROZEN. Everything else behaves normally."""

    @classmethod
    def now(cls, tz=None):
        return FROZEN.astimezone(tz) if tz else FROZEN.replace(tzinfo=None)


class _FrozenModule:
    """Stands in for the `datetime` module where a tool imported it as `dt`."""
    datetime = _FrozenDatetime
    timezone = dt.timezone
    timedelta = dt.timedelta
    date = dt.date
    time = dt.time


next_slot.datetime = _FrozenDatetime          # `from datetime import datetime, ...`
watchdog.dt = _FrozenModule                   # `import datetime as dt`


def slot(day_offset: int, et_hour: int) -> dt.datetime:
    """A publish slot `day_offset` days out at `et_hour`:00 America/New_York, as UTC.

    The slots are fixed in ET (11:00 / 17:00), so their UTC hour moves with DST: 15:00Z/21:00Z
    in summer, 16:00Z/22:00Z in winter. Hard-coding the summer UTC hours made this suite fail
    7 cases every winter while next_slot.py was right (found 2026-11-11, ten days after DST ended).
    """
    local = dt.datetime.combine(TODAY + dt.timedelta(days=day_offset), dt.time(et_hour, 0),
                                tzinfo=ZoneInfo("America/New_York"))
    return local.astimezone(dt.timezone.utc)


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
      got, [stamp(slot(0, 11)), stamp(slot(0, 17)), stamp(slot(1, 11)), stamp(slot(1, 17))])

# The regression that mattered: a batch whose push was refused leaves NOTHING in the repo, so the
# next batch must learn about those slots from the channel or it will double-book them.
got, _ = run_next_slot([slot(0, 11), slot(0, 17)], ["--fill", "2"])
check("slots filled by an unpushed batch are not offered again",
      got, [stamp(slot(1, 11)), stamp(slot(1, 17))])

got, err = run_next_slot([slot(0, 11), slot(0, 17), slot(1, 11), slot(1, 17)], ["--fill", "2"])
check("a full queue asks for nothing", got, [])
check("a full queue says why on stderr", "queue already full" in err, True)

got, _ = run_next_slot([], ["--fill", "3", "--max", "2"])
check("--max caps a catch-up run", got, [stamp(slot(0, 11)), stamp(slot(0, 17))])

got, _ = run_next_slot([], ["--fill", "1"], local={slot(0, 11)})
check("a local publish.json not yet uploaded still holds its slot", got, [stamp(slot(0, 17))])


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
      out.getvalue().split(), [stamp(slot(0, 11)), stamp(slot(0, 17))])
check("…and says so loudly", "warning: channel not readable" in err.getvalue(), True)

# ---------------------------------------------------------------- watchdog: what to alarm on
print("-- watchdog.py")
code, _, err = run_watchdog([slot(0, 11), slot(0, 17), slot(1, 11), slot(1, 17)], ["--hours", "24"])
check("a full day with a full buffer is healthy and silent", (code, "WARN" in err), (0, False))

code, _, err = run_watchdog([slot(0, 11), slot(0, 17)], ["--hours", "24"])
check("a full day with an eaten buffer passes but warns", (code, "WATCHDOG WARN" in err), (0, True))

# THE REGRESSION THIS FILE EXISTS FOR: one video is half a day, and used to report OK.
code, out, _ = run_watchdog([slot(0, 11)], ["--hours", "24"])
check("a HALF day fails", (code, "WATCHDOG OK" in out), (1, False))

code, _, _ = run_watchdog([], ["--hours", "24"])
check("an empty day fails", code, 1)

code, out, err = run_watchdog([slot(0, 11), slot(0, 17), slot(1, 11), slot(1, 17)], ["--quiet"])
check("--quiet stays silent only when everything is healthy", (code, out, err), (0, "", ""))

code, out, _ = run_watchdog([slot(0, 11), slot(0, 17)], ["--quiet"])
check("--quiet still reports an eaten buffer", (code, "SHORT" in out), (0, True))

print("")
if failures:
    print(f"SELFTEST FAILED: {len(failures)} case(s): " + "; ".join(failures))
    sys.exit(1)
print("SELFTEST OK — queue logic sound")
