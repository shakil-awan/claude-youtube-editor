#!/usr/bin/env python3
"""
selftest_upload.py — prove the upload metadata logic before it touches the channel.

yt_upload.py now decides four things a human used to type into Studio by hand (the AI
disclosure, the recording date, and the two language tags) and can PATCH VIDEOS THAT ARE
ALREADY LIVE. Both of those are dangerous to get wrong in opposite directions:

  * a wrong default silently mislabels every video the channel publishes;
  * a wrong videos.update body WIPES the fields it does not resend — that API replaces each
    part it is given, so a one-field metadata fix can delete a title, a description, or the
    publishAt that schedules a draft.

Neither failure raises an exception, and neither is visible until a human opens Studio. So the
pure functions are tested here against synthetic API payloads, with no network and no
credentials. Run it after touching yt_upload.py:

    python3 tools/selftest_upload.py       # exit 0 = the metadata logic is sound

Stdlib only — this must run before the venv exists, like the rest of the preflight family.
"""
import datetime as dt
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import yt_upload as yu                                # noqa: E402

TODAY = f"{dt.datetime.now(dt.timezone.utc).date():%Y-%m-%d}"
failures: list[str] = []


def check(name: str, got, want) -> None:
    if got != want:
        failures.append(f"{name}\n     got:  {got!r}\n     want: {want!r}")


def ok(name: str, cond: bool, detail: str = "") -> None:
    if not cond:
        failures.append(f"{name}{(' — ' + detail) if detail else ''}")


def clear_env() -> None:
    for var in ("YT_LANGUAGE", "YT_AUDIO_LANGUAGE", "YT_SYNTHETIC_MEDIA"):
        os.environ.pop(var, None)


PLAN = {
    "video": "videos/short-013/output/short-013.mp4",
    "title": "A Title",
    "description": "A description",
    "tags": ["ai"],
    "privacy": "private",
    "publishAt": "2026-09-08T15:00:00Z",
}


# ── 1. the defaults every upload now carries ─────────────────────────────────
def test_defaults() -> None:
    clear_env()
    body = yu.build_body(dict(PLAN))
    check("1.1 title/description language", body["snippet"]["defaultLanguage"], "en-US")
    check("1.2 spoken language", body["snippet"]["defaultAudioLanguage"], "en-US")
    check("1.3 AI disclosure defaults on", body["status"]["containsSyntheticMedia"], True)
    check("1.4 recording date defaults to today",
          body["recordingDetails"]["recordingDate"], f"{TODAY}T00:00:00Z")
    check("1.5 the schedule survives", body["status"]["publishAt"], "2026-09-08T15:00:00Z")
    check("1.6 every part is requested", yu.parts_of(body), "snippet,status,recordingDetails")


# ── 2. per-plan and per-environment overrides ────────────────────────────────
def test_overrides() -> None:
    clear_env()
    plan = dict(PLAN, language="es-ES", audioLanguage="es-MX",
                containsSyntheticMedia=False, recordingDate="2026-01-09")
    body = yu.build_body(plan)
    check("2.1 plan language wins", body["snippet"]["defaultLanguage"], "es-ES")
    check("2.2 plan audio language wins", body["snippet"]["defaultAudioLanguage"], "es-MX")
    check("2.3 a plan can turn the disclosure off",
          body["status"]["containsSyntheticMedia"], False)
    check("2.4 an explicit recording date is kept",
          body["recordingDetails"]["recordingDate"], "2026-01-09T00:00:00Z")

    os.environ["YT_LANGUAGE"] = "en-GB"
    os.environ["YT_SYNTHETIC_MEDIA"] = "0"
    body = yu.build_body(dict(PLAN))
    check("2.5 env sets both language tags", body["snippet"]["defaultAudioLanguage"], "en-GB")
    check("2.6 env can turn the disclosure off",
          body["status"]["containsSyntheticMedia"], False)
    os.environ["YT_AUDIO_LANGUAGE"] = "en-US"
    check("2.7 the audio env var is the more specific one",
          yu.build_body(dict(PLAN))["snippet"]["defaultAudioLanguage"], "en-US")
    clear_env()


# ── 3. validation catches the plans YouTube would reject ─────────────────────
def test_validation() -> None:
    clear_env()
    tomorrow = dt.datetime.now(dt.timezone.utc).date() + dt.timedelta(days=1)
    errs = yu.validate(dict(PLAN, recordingDate=f"{tomorrow:%Y-%m-%d}"))
    ok("3.1 a future recording date is an error",
       any("future" in e for e in errs), f"errors were {errs}")
    errs = yu.validate(dict(PLAN, language="english"))
    ok("3.2 a non-BCP-47 language is an error",
       any("BCP-47" in e for e in errs), f"errors were {errs}")
    errs = yu.validate(dict(PLAN, recordingDate="not-a-date"))
    ok("3.3 an unparsable recording date is an error",
       any("recordingDate" in e for e in errs), f"errors were {errs}")
    errs = yu.validate(dict(PLAN, recordingDate="2026-01-09", language="en-US"))
    ok("3.4 a good plan raises nothing about the details fields",
       not any(k in e for e in errs for k in ("BCP-47", "recordingDate")), f"errors were {errs}")


# ── 4. merge_update_body must never wipe a field it was not asked to change ──
LIVE = {
    "id": "vid123",
    "snippet": {"title": "Live Title", "description": "Live description",
                "tags": ["ai", "tools"], "categoryId": "28",
                "publishedAt": "2026-08-13T09:12:00Z"},
    "status": {"privacyStatus": "private", "publishAt": "2026-09-09T15:00:00Z",
               "license": "youtube", "embeddable": True, "publicStatsViewable": True,
               "selfDeclaredMadeForKids": False, "madeForKids": False},
    "recordingDetails": {},
}


def test_merge_preserves() -> None:
    body = yu.merge_update_body(LIVE, {"snippet": {"defaultLanguage": "en-US"}})
    check("4.1 the title survives a language patch", body["snippet"]["title"], "Live Title")
    check("4.2 the description survives", body["snippet"]["description"], "Live description")
    check("4.3 the tags survive", body["snippet"]["tags"], ["ai", "tools"])
    check("4.4 the category survives", body["snippet"]["categoryId"], "28")
    ok("4.5 an untouched part is not sent", "status" not in body and "recordingDetails" not in body,
       f"body carried {sorted(body)}")

    body = yu.merge_update_body(LIVE, {"status": {"containsSyntheticMedia": True}})
    check("4.6 the schedule survives a disclosure patch",
          body["status"]["publishAt"], "2026-09-09T15:00:00Z")
    check("4.7 privacy survives", body["status"]["privacyStatus"], "private")
    check("4.8 the disclosure is applied", body["status"]["containsSyntheticMedia"], True)

    public = dict(LIVE, status={"privacyStatus": "public", "publishAt": "2026-09-09T15:00:00Z",
                                "license": "youtube", "embeddable": True,
                                "publicStatsViewable": True, "selfDeclaredMadeForKids": False})
    body = yu.merge_update_body(public, {"status": {"containsSyntheticMedia": True}})
    ok("4.9 publishAt is not resent on a public video — YouTube 400s on that",
       "publishAt" not in body["status"], f"status was {body['status']}")


# ── 5. backfill fills empty fields, and does not overwrite deliberate ones ───
def test_backfill_patch() -> None:
    clear_env()
    pol = yu.policy()

    patch, reasons = yu.backfill_patch(LIVE, pol)
    check("5.1 an empty video gets both languages",
          patch["snippet"], {"defaultLanguage": "en-US", "defaultAudioLanguage": "en-US"})
    check("5.2 …the AI disclosure", patch["status"], {"containsSyntheticMedia": True})
    check("5.3 …and its upload day as the recording date",
          patch["recordingDetails"], {"recordingDate": "2026-08-13T00:00:00Z"})
    ok("5.4 every change is explained", len(reasons) == 4, f"reasons were {reasons}")

    done = {
        "id": "vid999",
        "snippet": dict(LIVE["snippet"], defaultLanguage="en-US", defaultAudioLanguage="en-US"),
        "status": dict(LIVE["status"], containsSyntheticMedia=True),
        "recordingDetails": {"recordingDate": "2026-08-13T00:00:00Z"},
    }
    patch, reasons = yu.backfill_patch(done, pol)
    check("5.5 a complete video is left alone", (patch, reasons), ({}, []))

    spanish = {
        "id": "vid888",
        "snippet": dict(LIVE["snippet"], defaultLanguage="es-ES", defaultAudioLanguage="es-ES"),
        "status": dict(LIVE["status"], containsSyntheticMedia=True),
        "recordingDetails": {"recordingDate": "2026-07-01T00:00:00Z"},
    }
    patch, _ = yu.backfill_patch(spanish, pol)
    check("5.6 a deliberate language is NOT overwritten", patch, {})
    patch, _ = yu.backfill_patch(spanish, pol, force=True)
    check("5.7 …unless --force says the policy wins",
          patch["snippet"], {"defaultLanguage": "en-US", "defaultAudioLanguage": "en-US"})

    undisclosed = dict(done, status=dict(LIVE["status"], containsSyntheticMedia=False))
    patch, _ = yu.backfill_patch(undisclosed, pol)
    check("5.8 a false disclosure is corrected (that is what an untouched upload reports)",
          patch, {"status": {"containsSyntheticMedia": True}})

    os.environ["YT_SYNTHETIC_MEDIA"] = "0"
    patch, _ = yu.backfill_patch(undisclosed, yu.policy())
    check("5.9 a channel that is not AI-generated never gets the disclosure forced on", patch, {})
    clear_env()

    # The one that decides whether `backfill --apply` on every batch converges or writes forever:
    # YouTube may echo the recording date back with milliseconds. Comparing strings would call
    # that a miss and re-send the same patch on every run, every day, at 50 quota units a video.
    millis = dict(done, recordingDetails={"recordingDate": "2026-08-13T00:00:00.000Z"})
    patch, _ = yu.backfill_patch(millis, pol)
    check("5.10 a date echoed back with millis is the same date — backfill converges", patch, {})
    ok("5.11 …and the comparison is day-level, not string-level",
       yu.same_value("recordingDate", "2026-08-13T00:00:00Z", "2026-08-13T00:00:00.000Z")
       and not yu.same_value("recordingDate", "2026-08-13T00:00:00Z", "2026-08-14T00:00:00Z")
       and not yu.same_value("recordingDate", "2026-08-13T00:00:00Z", None))


# ── 6. the retry ladder sheds one field at a time, upload last ──────────────
def test_retry_ladder() -> None:
    clear_env()
    body = yu.build_body(dict(PLAN))
    shed = []
    for part, field in yu.OPTIONAL_METADATA:
        if yu.drop_field(body, part, field):
            shed.append(f"{part}.{field}")
    check("6.1 every optional field can be shed", shed,
          ["recordingDetails.recordingDate", "status.containsSyntheticMedia",
           "snippet.defaultAudioLanguage", "snippet.defaultLanguage"])
    ok("6.2 an emptied part is removed from the body", "recordingDetails" not in body,
       f"body carried {sorted(body)}")
    check("6.3 the video itself is never at risk — title, privacy and schedule remain",
          (body["snippet"]["title"], body["status"]["privacyStatus"], body["status"]["publishAt"]),
          ("A Title", "private", "2026-09-08T15:00:00Z"))
    check("6.4 the part list follows the body", yu.parts_of(body), "snippet,status")


def main() -> int:
    for test in (test_defaults, test_overrides, test_validation, test_merge_preserves,
                 test_backfill_patch, test_retry_ladder):
        test()
    if failures:
        print(f"UPLOAD SELFTEST FAILED — {len(failures)} problem(s):")
        for f in failures:
            print(f"  x {f}")
        return 1
    print("upload selftest OK — details defaults, validation, update merge, backfill, retry ladder")
    return 0


if __name__ == "__main__":
    sys.exit(main())
