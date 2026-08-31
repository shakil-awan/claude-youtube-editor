#!/usr/bin/env python3
"""
ytqueue.py — read the channel's publish queue. The one source of truth about what is scheduled.

WHY THIS EXISTS (2026-08-31)
----------------------------
Two tools need the same answer to the same question — "which publish slots are already taken?" —
and until now neither could get it right:

  * watchdog.py asked YouTube, but only counted videos, so a day with ONE queued Short passed a
    check whose whole purpose is proving the channel is not going dark (policy is 2/day,
    NICHE-STRATEGY.md §4).
  * next_slot.py did not ask YouTube at all. It scanned local videos/*/publish.json, which is
    exactly the file a failed push leaves behind on the owner's machine and never in the repo.
    A cloud batch cloning a stale main therefore believed every slot was free and could
    double-book a time another batch had already filled.

The channel cannot go stale and no push failure can corrupt it. Both tools now read it here.

STDLIB ONLY, BY DESIGN — watchdog.py must keep running without a venv, before bootstrap, so this
module may never import anything that is not in the standard library.

Credentials: .youtube/token.json if present, else the YT_TOKEN_B64 environment secret. Values are
read to be exchanged for an access token and are never printed.
"""
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


class QueueUnavailable(RuntimeError):
    """The channel could not be read (no credentials, no network, refused token).

    Callers that can still do something useful without the channel catch this; callers whose
    whole job is checking the channel let it stop them.
    """


def load_token() -> dict:
    """OAuth material from disk, else from the environment secret. Never printed."""
    on_disk = REPO / ".youtube" / "token.json"
    if on_disk.exists():
        return json.loads(on_disk.read_text(encoding="utf-8"))
    raw = os.environ.get("YT_TOKEN_B64", "").strip()
    if not raw:
        raise QueueUnavailable("no .youtube/token.json and no YT_TOKEN_B64 — cannot read the channel")
    try:
        return json.loads(base64.b64decode(raw))
    except Exception as exc:                          # noqa: BLE001 - surface the shape, not the value
        raise QueueUnavailable(f"YT_TOKEN_B64 is not valid base64 JSON ({type(exc).__name__})") from exc


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
        raise QueueUnavailable(f"token refresh rejected (HTTP {exc.code}): {detail}") from exc
    except urllib.error.URLError as exc:
        raise QueueUnavailable(f"token endpoint unreachable ({exc.reason})") from exc


def api(token: str, path: str, **params) -> dict:
    url = API + path + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def channel_videos() -> tuple[str, list[dict]]:
    """(channel title, every video on the channel) — private, scheduled and public alike.

    Each video is {"slot": aware datetime, "id", "title", "privacy"}. "slot" is the moment the
    video goes (or went) public: status.publishAt for a scheduled private video, else
    snippet.publishedAt.
    """
    at = access_token(load_token())
    channels = api(at, "channels", part="contentDetails,snippet", mine="true")
    if not channels.get("items"):
        raise QueueUnavailable("this token has no channel")
    channel = channels["items"][0]
    uploads = channel["contentDetails"]["relatedPlaylists"]["uploads"]

    ids: list[str] = []
    page = None
    while True:
        extra = {"pageToken": page} if page else {}
        batch = api(at, "playlistItems", part="contentDetails", playlistId=uploads,
                    maxResults=50, **extra)
        ids += [i["contentDetails"]["videoId"] for i in batch["items"]]
        page = batch.get("nextPageToken")
        if not page:
            break

    videos = []
    for start in range(0, len(ids), 50):
        chunk = api(at, "videos", part="snippet,status", id=",".join(ids[start:start + 50]))
        for item in chunk["items"]:
            snip, stat = item["snippet"], item["status"]
            when = stat.get("publishAt") or snip["publishedAt"]
            videos.append({
                "slot": dt.datetime.fromisoformat(when.replace("Z", "+00:00")),
                "id": item["id"],
                "title": snip["title"],
                "privacy": stat.get("privacyStatus", "?"),
            })
    videos.sort(key=lambda v: v["slot"])
    return channel["snippet"]["title"], videos


def claimed_slots() -> set[dt.datetime]:
    """Every publish moment the channel already holds, to the second, in UTC.

    This is what makes double-booking impossible: a slot is taken if a video exists at it, whether
    or not this checkout knows about that video.
    """
    _, videos = channel_videos()
    return {v["slot"].astimezone(dt.timezone.utc).replace(microsecond=0) for v in videos}


def by_day(videos: list[dict], tz: dt.tzinfo = dt.timezone.utc) -> dict[str, list[dict]]:
    """Group videos by the calendar day of their slot (YYYY-MM-DD), in `tz`."""
    days: dict[str, list[dict]] = {}
    for v in videos:
        days.setdefault(v["slot"].astimezone(tz).strftime("%Y-%m-%d"), []).append(v)
    return days


if __name__ == "__main__":                            # a quick human-readable dump of the queue
    try:
        name, vids = channel_videos()
    except QueueUnavailable as exc:
        sys.exit(f"queue unavailable: {exc}")
    now = dt.datetime.now(dt.timezone.utc)
    print(f"channel: {name}   videos: {len(vids)}   now: {now:%Y-%m-%d %H:%M}Z")
    for v in vids:
        tense = "queued " if v["slot"] > now else "live   "
        print(f"  {v['slot']:%Y-%m-%d %H:%M}Z  {tense} {v['privacy']:8} {v['id']}  {v['title'][:56]}")
