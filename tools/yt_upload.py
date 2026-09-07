#!/usr/bin/env python3
"""
yt_upload.py — upload a short or long-form video to YouTube from a declarative plan.

One tool for both formats: YouTube auto-classifies a Short by its shape (vertical, ≤3 min)
+ metadata — there is no separate Shorts endpoint. The tool uploads the file, sets
title/description/tags/category, sets the DETAILS FIELDS YouTube asks every creator to fill
(see below), sets the custom thumbnail, and sets privacy/schedule.

DRAFT MODE (default): uploads land as PRIVATE drafts; publish or schedule
them in YouTube Studio with one click. This also sidesteps the API's unaudited-project
restriction, which force-locks every upload from an unaudited project to private anyway.
(To later schedule public directly from the API, the Google Cloud project must pass YouTube's
one-time compliance audit; then set "privacy":"private" + a "publishAt" RFC3339 time.)

THE DETAILS FIELDS (2026-09-07)
-------------------------------
Every upload used to land with four Studio fields empty, and the owner filled them by hand on
each of the ~2 videos a day this channel publishes: "Altered or synthetic content", the
recording date, and the video + audio language. They are all settable from the API, so nothing
should be typed twice:

  status.containsSyntheticMedia   → the AI disclosure. TRUE by default: this channel's Shorts
                                    are an AI voice over AI-generated art, which is exactly the
                                    realistic-synthetic content YouTube asks be disclosed.
                                    Added to the Data API on 2024-10-30.
  recordingDetails.recordingDate  → "video date". Defaults to today (UTC) — YouTube rejects a
                                    future date, and validate() catches one before the upload.
  snippet.defaultLanguage         → the language of the title/description  (default en-US)
  snippet.defaultAudioLanguage    → the language spoken in the audio track (default en-US)

Every one of them is overridable per-plan and by environment variable (see POLICY below), and
each is dropped-and-retried individually if the API ever refuses it, so a metadata field can
never cost the upload itself.

NOT SETTABLE FROM THE API: the "Video location" box in Studio. recordingDetails.location and
.locationDescription were deprecated by Google (locationDescription on 2017-06-01, the lat/long
trio since), and writes to them are silently discarded. A plan may still carry "recordingLocation"
for the record — it is reported, never sent. The channel's country lives on the CHANNEL (Studio →
Settings → Channel → Advanced → Country of residence), not on each video, and once set there it
applies to everything. `whoami` prints it so you can see it is set.

Setup (one-time, needs your browser — see tools/yt_upload_SETUP.md):
  1. Google Cloud project + enable "YouTube Data API v3".
  2. OAuth "Desktop app" credential → download as .youtube/client_secret.json.
  3. `python tools/yt_upload.py auth`  (opens a browser once; saves .youtube/token.json)

Usage:
  python tools/yt_upload.py auth
  python tools/yt_upload.py upload videos/short-013/publish.json
  python tools/yt_upload.py upload <plan> --dry-run     # validate plan + preview, no API call
  python tools/yt_upload.py whoami                        # channel + country + upload defaults
  python tools/yt_upload.py backfill                      # what the back catalogue is missing
  python tools/yt_upload.py backfill --apply              # …and fill it in

POLICY (defaults, overridable):
  per plan : "language", "audioLanguage", "recordingDate", "containsSyntheticMedia"
  per env  : YT_LANGUAGE, YT_AUDIO_LANGUAGE, YT_SYNTHETIC_MEDIA (0/false to turn the AI
             disclosure off for a channel that is not AI-generated)

Requires (real upload only; --dry-run needs none of these):
  pip install google-api-python-client google-auth-oauthlib google-auth-httplib2

Quota: standard = 10,000 units/day; an upload costs ~100 units (cut from 1,600 on 2025-12-04)
→ ~100 uploads/day. A videos.update (the settle + backfill path) costs 50, a list costs 1.
Some new projects start at 0 "Queries per day" and must request quota via the YouTube API
Services Audit & Quota Extension form (or use an older project that has 10,000).
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
import time
from pathlib import Path

# Windows consoles default to cp1252 — force UTF-8 so box/✓ glyphs print
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

REPO = Path(__file__).resolve().parent.parent   # core/ — the engine root, holds .youtube/ creds
ROOT = REPO.parent                               # monorepo root — plan paths (video, description_file) are relative to this
YT_DIR = REPO / ".youtube"
CLIENT_SECRET = YT_DIR / "client_secret.json"
TOKEN = YT_DIR / "token.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube"]  # .../youtube covers thumbnails.set + edits

TITLE_MAX, DESC_MAX, TAGS_CHARS_MAX = 100, 5000, 460
# common categories: 27 Education · 28 Science & Technology · 22 People & Blogs
DEFAULT_CATEGORY = 28

# ── the details policy ────────────────────────────────────────────────────────
# Defaults for the four Studio fields the API can fill. Env vars override these for the whole
# channel; a plan key overrides both for one video.
DEFAULT_LANGUAGE = "en-US"          # title/description language
DEFAULT_AUDIO_LANGUAGE = "en-US"    # spoken language
DEFAULT_SYNTHETIC_MEDIA = True      # the AI / altered-content disclosure
LANG_RE = re.compile(r"^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$")   # BCP-47 shape, e.g. en, en-US

# Fields the metadata retry ladder may drop, newest-API-feature first: if the API refuses the
# body, the youngest field is the likeliest cause and the upload must survive losing it.
OPTIONAL_METADATA = [
    ("recordingDetails", "recordingDate"),
    ("status", "containsSyntheticMedia"),
    ("snippet", "defaultAudioLanguage"),
    ("snippet", "defaultLanguage"),
]


def rp(p: str) -> Path:
    # Resolve relative paths against the CWD first (this repo's convention: run from the repo
    # root), then the repo itself, then the legacy monorepo parent — first hit wins.
    q = Path(p)
    if q.is_absolute():
        return q
    for base in (Path.cwd(), REPO, ROOT):
        if (base / q).exists():
            return base / q
    return ROOT / q


def load_plan(path: Path) -> dict:
    plan = json.loads(path.read_text(encoding="utf-8"))
    if "description_file" in plan and "description" not in plan:
        plan["description"] = rp(plan["description_file"]).read_text(encoding="utf-8").strip()
    return plan


# ── policy resolution ─────────────────────────────────────────────────────────
def _env(name: str, fallback: str) -> str:
    value = os.environ.get(name, "").strip()
    return value or fallback


def _truthy(value, fallback: bool) -> bool:
    if value is None or value == "":
        return fallback
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ("1", "true", "yes", "on")


def policy() -> dict:
    """Channel-wide defaults for the details fields, after environment overrides."""
    return {
        "language": _env("YT_LANGUAGE", DEFAULT_LANGUAGE),
        "audioLanguage": _env("YT_AUDIO_LANGUAGE", _env("YT_LANGUAGE", DEFAULT_AUDIO_LANGUAGE)),
        "containsSyntheticMedia": _truthy(os.environ.get("YT_SYNTHETIC_MEDIA"),
                                          DEFAULT_SYNTHETIC_MEDIA),
    }


def today_utc() -> dt.date:
    return dt.datetime.now(dt.timezone.utc).date()


def recording_date(plan: dict, *, today: dt.date | None = None) -> str:
    """RFC3339 recording date for this upload.

    "today" (the default) is the day the video was produced, which for this pipeline is the day
    it is uploaded. A plan may pass a YYYY-MM-DD or a full RFC3339 stamp instead. YouTube rejects
    a recording date in the future, which the default can never be; an explicitly-set future date
    is a plan error and validate() catches it before the upload starts.
    """
    today = today or today_utc()
    raw = str(plan.get("recordingDate", "today")).strip()
    if raw.lower() in ("today", "", "auto"):
        day = today
    else:
        try:
            day = dt.datetime.fromisoformat(raw.replace("Z", "+00:00")).date()
        except ValueError:
            day = dt.date.fromisoformat(raw[:10])       # raises on genuine garbage
    return f"{day:%Y-%m-%d}T00:00:00Z"


def validate(plan: dict) -> list[str]:
    errs = []
    if not plan.get("video"):
        errs.append("plan.video is required")
    elif not rp(plan["video"]).exists():
        errs.append(f"video not found: {plan['video']}")
    if not plan.get("title"):
        errs.append("plan.title is required")
    elif len(plan["title"]) > TITLE_MAX:
        errs.append(f"title is {len(plan['title'])} chars (max {TITLE_MAX})")
    if "|" in plan.get("title", "") or "<" in plan.get("title", "") or ">" in plan.get("title", ""):
        errs.append("title cannot contain < > | (YouTube rejects these)")
    if len(plan.get("description", "")) > DESC_MAX:
        errs.append(f"description is {len(plan['description'])} chars (max {DESC_MAX})")
    tags = plan.get("tags", [])
    if sum(len(t) for t in tags) + max(0, len(tags) - 1) > TAGS_CHARS_MAX:
        errs.append(f"tags exceed ~{TAGS_CHARS_MAX} total chars")
    thumb = plan.get("thumbnail")
    if thumb:
        tp = rp(thumb)
        if not tp.exists():
            errs.append(f"thumbnail not found: {thumb}")
        elif tp.stat().st_size > 2 * 1024 * 1024:
            errs.append(f"thumbnail is {tp.stat().st_size / 1e6:.1f} MB (YouTube max 2 MB) — use a JPG")
    if plan.get("publishAt") and plan.get("privacy", "private") != "private":
        errs.append("publishAt requires privacy=private (YouTube holds it private until that time)")

    pol = policy()
    for key, default in (("language", pol["language"]), ("audioLanguage", pol["audioLanguage"])):
        tag = str(plan.get(key, default))
        if not LANG_RE.match(tag):
            errs.append(f"{key} {tag!r} is not a BCP-47 language tag (e.g. en-US)")
    try:
        stamp = recording_date(plan)
        if plan.get("recordingDate") and stamp[:10] > f"{today_utc():%Y-%m-%d}":
            errs.append(f"recordingDate {stamp[:10]} is in the future — YouTube rejects that")
    except ValueError:
        errs.append(f"recordingDate {plan.get('recordingDate')!r} is not a date (use YYYY-MM-DD or \"today\")")
    return errs


def build_body(plan: dict) -> dict:
    pol = policy()
    snippet = {
        "title": plan["title"],
        "description": plan.get("description", ""),
        "tags": plan.get("tags", []),
        "categoryId": str(plan.get("categoryId", DEFAULT_CATEGORY)),
        "defaultLanguage": plan.get("language", pol["language"]),
        "defaultAudioLanguage": plan.get("audioLanguage", pol["audioLanguage"]),
    }
    status = {
        "privacyStatus": plan.get("privacy", "private"),
        "selfDeclaredMadeForKids": bool(plan.get("madeForKids", False)),
        "containsSyntheticMedia": _truthy(plan.get("containsSyntheticMedia"),
                                          pol["containsSyntheticMedia"]),
    }
    if plan.get("publishAt"):
        status["publishAt"] = plan["publishAt"]
    return {
        "snippet": snippet,
        "status": status,
        "recordingDetails": {"recordingDate": recording_date(plan)},
    }


def parts_of(body: dict) -> str:
    return ",".join(k for k in ("snippet", "status", "recordingDetails") if body.get(k))


def same_value(field: str, want, have) -> bool:
    """Does the channel already hold what we want?

    recordingDate is the one field YouTube may echo back in a different-but-equal shape
    (`…T00:00:00Z` vs `…T00:00:00.000Z`), and comparing the strings would make every run decide
    the patch had not stuck and re-send it — a write loop that never converges. Only the day is
    ever meaningful here, so only the day is compared.
    """
    if field == "recordingDate":
        return bool(want) and bool(have) and str(want)[:10] == str(have)[:10]
    return want == have


def preview(plan: dict, body: dict) -> None:
    s, st, rec = body["snippet"], body["status"], body.get("recordingDetails", {})
    thumb = plan.get("thumbnail")
    print("── upload preview ─────────────────────────────")
    print(f"video      : {plan['video']}  ({rp(plan['video']).stat().st_size / 1e6:.1f} MB)")
    print(f"title      : {s['title']}  ({len(s['title'])}/{TITLE_MAX})")
    print(f"category   : {s['categoryId']}   privacy: {st['privacyStatus']}   kids: {st['selfDeclaredMadeForKids']}")
    print(f"publishAt  : {st.get('publishAt', '(none — stays private draft until you publish)')}")
    print(f"AI content : containsSyntheticMedia={st['containsSyntheticMedia']}  "
          f"(Studio: 'Altered or synthetic content')")
    print(f"recorded   : {rec.get('recordingDate', '(none)')}")
    print(f"language   : title/desc {s['defaultLanguage']}   audio {s['defaultAudioLanguage']}")
    if plan.get("recordingLocation"):
        print(f"location   : {plan['recordingLocation']} — NOT SENT: the API's recordingDetails.location")
        print("             is deprecated and discarded. Set it in Studio if you need it.")
    print(f"tags       : {', '.join(s['tags']) or '(none)'}")
    print(f"thumbnail  : {thumb or '(none)'}" + ("" if not thumb else f"  ({rp(thumb).stat().st_size / 1e3:.0f} KB)"))
    print(f"description: {len(s['description'])} chars")
    print("   " + "\n   ".join(s["description"].splitlines()[:4]) + (" …" if len(s['description'].splitlines()) > 4 else ""))
    print("───────────────────────────────────────────────")


def get_creds():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow

    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES) if TOKEN.exists() else None
    if creds and creds.valid:
        return creds
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        if not CLIENT_SECRET.exists():
            sys.exit(f"missing {CLIENT_SECRET} — see tools/yt_upload_SETUP.md (step 2)")
        creds = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES).run_local_server(port=0)
    YT_DIR.mkdir(exist_ok=True)
    TOKEN.write_text(creds.to_json())
    return creds


def service():
    from googleapiclient.discovery import build
    return build("youtube", "v3", credentials=get_creds())


# ── the metadata retry ladder ─────────────────────────────────────────────────
def drop_field(body: dict, part: str, field: str) -> bool:
    """Remove one optional field from the body. True if it was there to remove."""
    if part in body and field in body[part]:
        body[part].pop(field)
        if not body[part]:
            body.pop(part)
        return True
    return False


def rejected_metadata(exc) -> bool:
    """Is this HttpError the API refusing a metadata FIELD (rather than a real upload failure)?"""
    if getattr(exc, "resp", None) is None or exc.resp.status != 400:
        return False
    detail = str(getattr(exc, "content", b"") or "") + str(exc)
    return any(k in detail for k in ("invalidMetadata", "invalidRecordingDetails",
                                     "invalidDefaultBroadcastPrivacySetting",
                                     "invalidLanguage", "invalidVideoMetadata", "badRequest"))


def do_upload(plan: dict) -> None:
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload

    yt = service()
    body = build_body(plan)
    wanted = json.loads(json.dumps(body))          # what we asked for, for the settle check
    dropped: list[str] = []

    resp = None
    while resp is None:
        media = MediaFileUpload(str(rp(plan["video"])), chunksize=8 * 1024 * 1024, resumable=True)
        req = yt.videos().insert(part=parts_of(body), body=body, media_body=media)
        print("uploading… (resumable)")
        retries = 0
        try:
            while resp is None:
                status, resp = req.next_chunk()
                if status:
                    print(f"  {int(status.progress() * 100)}%")
        except HttpError as e:
            if e.resp.status in (500, 502, 503, 504) and retries < 5:
                retries += 1
                time.sleep(2 ** retries)
                continue
            # A field the API will not take must never cost the video. Shed the youngest
            # optional field and go again; anything else is a real failure.
            if rejected_metadata(e):
                for part, field in OPTIONAL_METADATA:
                    if drop_field(body, part, field):
                        dropped.append(f"{part}.{field}")
                        print(f"! API refused {part}.{field} — retrying without it "
                              f"({str(e)[:160]})")
                        break
                else:
                    raise
                continue
            raise

    vid = resp["id"]
    print(f"✓ uploaded (private draft): https://studio.youtube.com/video/{vid}/edit")
    if dropped:
        print(f"! these fields were refused and left unset: {', '.join(dropped)} — "
              f"set them in Studio, and open an issue: the API accepted them before.")

    settle(yt, vid, wanted, skip=set(dropped))

    thumb = plan.get("thumbnail")
    if thumb:
        try:
            from googleapiclient.http import MediaFileUpload as MFU
            yt.thumbnails().set(videoId=vid, media_body=MFU(str(rp(thumb)))).execute()
            print(f"• thumbnail API call sent: {thumb}")
            print("  ⚠ SHORTS CAVEAT: for a vertical ≤3-min video YouTube usually IGNORES this —")
            print("    the call returns success but the cover stays blank. If Studio shows")
            print("    'change the thumbnail in the YouTube mobile app', set the cover in the")
            print("    YouTube MOBILE APP (upload the .jpg). Desktop Studio + API can't do Shorts covers.")
        except HttpError as e:
            print(f"! thumbnail upload failed ({e.resp.status}) — set it in the YouTube mobile app.")
    if plan.get("recordingLocation"):
        print(f"• video location {plan['recordingLocation']!r} was NOT sent — the API deprecated "
              f"recordingDetails.location. Set it in Studio, or leave it: the channel's country "
              f"(Settings → Channel → Advanced) is what YouTube actually uses.")
    print(f"\nNext: open Studio, review, then Publish or Schedule.\n  https://studio.youtube.com/video/{vid}/edit")


def settle(yt, vid: str, wanted: dict, *, skip: set[str] | None = None) -> None:
    """Read the video back and repair any details field that did not stick.

    videos.insert has been observed to accept a body and store part of it — the details fields
    are exactly the ones that go missing, and nobody notices until a human opens Studio. So the
    upload is not finished until the channel agrees with the plan.
    """
    from googleapiclient.errors import HttpError
    skip = skip or set()
    try:
        got = yt.videos().list(part="snippet,status,recordingDetails", id=vid).execute()
    except HttpError as e:
        print(f"! could not read the video back to confirm its details ({e.resp.status}) — check Studio.")
        return
    if not got.get("items"):
        print("! the video did not come back from videos.list — check Studio.")
        return
    item = got["items"][0]

    fixes, patch = [], {}
    for part, field in OPTIONAL_METADATA:
        if f"{part}.{field}" in skip or field not in wanted.get(part, {}):
            continue
        want, have = wanted[part][field], item.get(part, {}).get(field)
        if same_value(field, want, have):
            continue
        fixes.append(f"{part}.{field}: {have!r} → {want!r}")
        patch.setdefault(part, {})[field] = want

    if not fixes:
        print("✓ details confirmed on the channel: AI disclosure, recording date, languages")
        return
    print("• details did not stick on insert — patching: " + "; ".join(fixes))
    body = merge_update_body(item, patch)
    try:
        yt.videos().update(part=parts_of(body), body={"id": vid, **body}).execute()
        print("✓ patched")
    except HttpError as e:
        print(f"! patch failed ({e.resp.status}: {str(e)[:200]}) — set these in Studio: "
              + "; ".join(fixes))


def merge_update_body(item: dict, patch: dict) -> dict:
    """A videos.update body that changes `patch` and preserves everything else.

    videos.update REPLACES each part it is given, so a part must be sent complete or the fields
    left out are wiped. This is the function that keeps a metadata fix from deleting a title.
    """
    snip, stat, rec = item.get("snippet", {}), item.get("status", {}), item.get("recordingDetails", {})
    body: dict = {}

    if "snippet" in patch:
        merged = {
            "title": snip.get("title", ""),
            "description": snip.get("description", ""),
            "tags": snip.get("tags", []),
            "categoryId": str(snip.get("categoryId", DEFAULT_CATEGORY)),
        }
        for key in ("defaultLanguage", "defaultAudioLanguage"):
            value = patch["snippet"].get(key, snip.get(key))
            if value:
                merged[key] = value
        body["snippet"] = merged

    if "status" in patch:
        merged = {
            "privacyStatus": stat.get("privacyStatus", "private"),
            "selfDeclaredMadeForKids": bool(stat.get("selfDeclaredMadeForKids", False)),
            "license": stat.get("license", "youtube"),
            "embeddable": bool(stat.get("embeddable", True)),
            "publicStatsViewable": bool(stat.get("publicStatsViewable", True)),
        }
        # publishAt only means anything while the video is still a scheduled private draft;
        # sending it on a public video is an error, and dropping it on a scheduled one would
        # silently un-schedule the video.
        if merged["privacyStatus"] == "private" and stat.get("publishAt"):
            merged["publishAt"] = stat["publishAt"]
        for key in ("containsSyntheticMedia",):
            value = patch["status"].get(key, stat.get(key))
            if value is not None:
                merged[key] = bool(value)
        body["status"] = merged

    if "recordingDetails" in patch:
        merged = dict(rec)
        merged.update(patch["recordingDetails"])
        body["recordingDetails"] = merged
    return body


# ── backfill: the videos already on the channel ───────────────────────────────
def uploads_playlist(yt) -> str:
    ch = yt.channels().list(part="contentDetails", mine=True).execute()
    if not ch.get("items"):
        sys.exit("this token has no channel")
    return ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]


def channel_video_ids(yt, limit: int | None = None) -> list[str]:
    ids, page = [], None
    playlist = uploads_playlist(yt)
    while True:
        extra = {"pageToken": page} if page else {}
        batch = yt.playlistItems().list(part="contentDetails", playlistId=playlist,
                                        maxResults=50, **extra).execute()
        ids += [i["contentDetails"]["videoId"] for i in batch["items"]]
        page = batch.get("nextPageToken")
        if not page or (limit and len(ids) >= limit):
            break
    return ids[:limit] if limit else ids


def backfill_patch(item: dict, pol: dict, *, force: bool = False) -> tuple[dict, list[str]]:
    """What this existing video is missing, and the patch that fills it.

    FILL, DON'T OVERWRITE. A video whose language or recording date was set deliberately (in
    Studio, or by a different plan) keeps it — only empty fields are filled — unless --force says
    the policy wins. containsSyntheticMedia is the exception in one direction: a missing OR false
    disclosure is set true under a policy that says this channel's videos are AI-generated, since
    "false" is also what an untouched upload reports.
    """
    snip, stat, rec = item.get("snippet", {}), item.get("status", {}), item.get("recordingDetails", {})
    patch: dict = {}
    reasons: list[str] = []

    for field, want in (("defaultLanguage", pol["language"]),
                        ("defaultAudioLanguage", pol["audioLanguage"])):
        have = snip.get(field)
        if have == want:
            continue
        if have and not force:
            continue
        patch.setdefault("snippet", {})[field] = want
        reasons.append(f"{field} {have or '—'} → {want}")

    if pol["containsSyntheticMedia"] and not stat.get("containsSyntheticMedia"):
        patch.setdefault("status", {})["containsSyntheticMedia"] = True
        reasons.append("AI disclosure → true")

    if not rec.get("recordingDate") or force:
        # The day it was made. The upload timestamp is the only honest evidence we still have
        # for a video already on the channel.
        published = snip.get("publishedAt", "")[:10] or f"{today_utc():%Y-%m-%d}"
        want = f"{min(published, f'{today_utc():%Y-%m-%d}')}T00:00:00Z"
        if not same_value("recordingDate", want, rec.get("recordingDate")):
            patch.setdefault("recordingDetails", {})["recordingDate"] = want
            reasons.append(f"recordingDate {(rec.get('recordingDate') or '—')[:10]} → {want[:10]}")

    return patch, reasons


def do_backfill(apply: bool, limit: int | None, force: bool, only: list[str]) -> int:
    from googleapiclient.errors import HttpError
    yt = service()
    pol = policy()
    ids = only or channel_video_ids(yt, limit)
    if not ids:
        print("no videos on this channel")
        return 0
    print(f"policy: language={pol['language']} audio={pol['audioLanguage']} "
          f"AI-disclosure={pol['containsSyntheticMedia']}   videos: {len(ids)}"
          + ("   MODE: apply" if apply else "   MODE: dry-run (add --apply to write)"))

    changed = failed = 0
    for start in range(0, len(ids), 50):
        got = yt.videos().list(part="snippet,status,recordingDetails",
                               id=",".join(ids[start:start + 50])).execute()
        for item in got.get("items", []):
            patch, reasons = backfill_patch(item, pol, force=force)
            title = item["snippet"]["title"][:52]
            if not patch:
                print(f"  ok    {item['id']}  {title}")
                continue
            changed += 1
            print(f"  FIX   {item['id']}  {title}\n          " + "\n          ".join(reasons))
            if not apply:
                continue
            body = merge_update_body(item, patch)
            try:
                yt.videos().update(part=parts_of(body), body={"id": item["id"], **body}).execute()
                print("          ✓ applied")
            except HttpError as e:
                failed += 1
                print(f"          ! failed ({e.resp.status}): {str(e)[:200]}")

    verb = "patched" if apply else "would patch"
    print(f"\n{verb} {changed} video(s); {len(ids) - changed} already correct"
          + (f"; {failed} FAILED" if failed else ""))
    if changed and not apply:
        print("re-run with --apply to write these to YouTube.")
    return 1 if failed else 0


def do_whoami() -> None:
    yt = service()
    ch = yt.channels().list(part="snippet,status,brandingSettings", mine=True).execute()
    items = ch.get("items", [])
    if not items:
        print("(no channel on this account)")
        return
    snip = items[0]["snippet"]
    branding = items[0].get("brandingSettings", {}).get("channel", {})
    pol = policy()
    print(snip["title"])
    print(f"  channel country : {snip.get('country') or branding.get('country') or 'NOT SET'}"
          f"   (Studio → Settings → Channel → Advanced; this is YouTube's video 'location')")
    print(f"  upload defaults : language {pol['language']} · audio {pol['audioLanguage']} · "
          f"AI disclosure {pol['containsSyntheticMedia']} · recording date today")


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("auth", help="one-time browser OAuth")
    sub.add_parser("whoami", help="print the authorized channel, its country and the upload defaults")
    up = sub.add_parser("upload", help="upload a video from a publish.json plan")
    up.add_argument("plan")
    up.add_argument("--dry-run", action="store_true", help="validate + preview, no API call")
    bf = sub.add_parser("backfill", help="fill the details fields on videos already uploaded")
    bf.add_argument("--apply", action="store_true", help="write the changes (default: dry-run)")
    bf.add_argument("--limit", type=int, default=None, help="only the N most recent uploads")
    bf.add_argument("--video-id", action="append", default=[], metavar="ID",
                    help="only this video (repeatable)")
    bf.add_argument("--force", action="store_true",
                    help="overwrite values already set, instead of only filling empty ones")
    args = ap.parse_args()

    if args.cmd == "auth":
        get_creds()
        print(f"✓ authorized — token saved to {TOKEN.relative_to(REPO)}")
        return
    if args.cmd == "whoami":
        do_whoami()
        return
    if args.cmd == "backfill":
        sys.exit(do_backfill(args.apply, args.limit, args.force, args.video_id))

    plan_path = rp(args.plan)
    if not plan_path.exists():
        sys.exit(f"plan not found: {args.plan}")
    plan = load_plan(plan_path)
    errs = validate(plan)
    if errs:
        print("PLAN ERRORS:")
        for e in errs:
            print(f"  ✗ {e}")
        sys.exit(1)
    body = build_body(plan)
    preview(plan, body)
    if args.dry_run:
        print("dry-run OK — plan is valid. Remove --dry-run to upload.")
        return
    do_upload(plan)


if __name__ == "__main__":
    main()
