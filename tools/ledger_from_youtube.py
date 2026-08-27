#!/usr/bin/env python3
"""
ledger_from_youtube.py — rebuild the published-topic history from the channel itself.

WHY: videos/publish-log.md is the 14-day dedup memory /write-short reads, but it only stays
accurate if every batch can push. When a batch cannot push (a bad GH_PAT, or the sandbox git
proxy refusing a repo that is not in the session's sources), the next batch clones a stale repo
and re-covers ground it already covered — that is how short-007 and short-008 shipped the same
idea six hours apart.

The channel is the one source of truth that a failed push cannot corrupt: it already knows every
video that exists, including ones still private and scheduled. This tool reads it back.

Usage (from the repo root, after bootstrap):
    ./venv/bin/python tools/ledger_from_youtube.py              # markdown table, newest last
    ./venv/bin/python tools/ledger_from_youtube.py --days 14    # only the dedup window
    ./venv/bin/python tools/ledger_from_youtube.py --json       # machine-readable
    ./venv/bin/python tools/ledger_from_youtube.py --merge      # merge missing rows into the ledger

--merge appends any video that the channel has but publish-log.md does not, so a repo that missed
a push can be repaired from the channel rather than by hand.
"""
import argparse
import datetime as dt
import importlib.util
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LEDGER = REPO / "videos" / "publish-log.md"


def yt_service():
    """Reuse yt_upload.py's authenticated client rather than duplicating the OAuth handling."""
    spec = importlib.util.spec_from_file_location("ytu", REPO / "tools" / "yt_upload.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.service()


def fetch(days: int | None) -> list[dict]:
    yt = yt_service()
    channels = yt.channels().list(part="contentDetails,snippet", mine=True).execute()
    if not channels.get("items"):
        sys.exit("no channel on this token — run tools/yt_upload.py whoami")
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

    rows = []
    for start in range(0, len(ids), 50):
        chunk = yt.videos().list(part="snippet,status", id=",".join(ids[start:start + 50])).execute()
        for item in chunk["items"]:
            snip, stat = item["snippet"], item["status"]
            rows.append({
                "video_id": item["id"],
                "title": snip["title"],
                "published_at": snip["publishedAt"],
                "slot": stat.get("publishAt") or snip["publishedAt"],
                "privacy": stat.get("privacyStatus", "?"),
                "tags": snip.get("tags", []),
                # First sentence of the description is the topic in the batch's own words.
                "topic": re.split(r"(?<=[.!?])\s", (snip.get("description") or "").strip())[0][:150],
            })

    rows.sort(key=lambda r: r["slot"])
    if days is not None:
        cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
        rows = [r for r in rows
                if dt.datetime.fromisoformat(r["slot"].replace("Z", "+00:00")) >= cutoff]
    return rows


def as_markdown(rows: list[dict]) -> str:
    out = ["| slot (UTC) | video id | privacy | title | topic |", "|---|---|---|---|---|"]
    for r in rows:
        title = r["title"].replace("|", "\\|")
        topic = r["topic"].replace("|", "\\|").replace("\n", " ")
        out.append(f"| {r['slot']} | {r['video_id']} | {r['privacy']} | {title} | {topic} |")
    return "\n".join(out)


def merge(rows: list[dict]) -> int:
    """Append rows the ledger is missing. Returns how many were added."""
    if not LEDGER.exists():
        sys.exit(f"ledger not found: {LEDGER}")
    text = LEDGER.read_text(encoding="utf-8")
    missing = [r for r in rows if r["video_id"] not in text]
    if not missing:
        print("ledger already has every video the channel knows about")
        return 0

    lines = text.splitlines()
    # Insert after the last existing table row so the trailing prose notes stay at the bottom.
    last_row = max((i for i, l in enumerate(lines) if l.startswith("| 20")), default=len(lines) - 1)
    added = []
    for r in missing:
        date = r["slot"][:10]
        note = ("Recovered from the channel by tools/ledger_from_youtube.py — this batch could not "
                "push, so the row was reconstructed from YouTube rather than lost.")
        added.append(
            f"| {date} | (unpushed) | {r['video_id']} | {r['title']} | (see topic) | "
            f"{r['topic']} | {r['slot']} | {note} |"
        )
    lines[last_row + 1:last_row + 1] = added
    LEDGER.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"merged {len(added)} row(s) into {LEDGER.relative_to(REPO)}")
    return len(added)


def main() -> None:
    ap = argparse.ArgumentParser(description="Published-topic history, read from the channel.")
    ap.add_argument("--days", type=int, default=None, help="only videos slotted in the last N days")
    ap.add_argument("--json", action="store_true", help="emit JSON instead of a markdown table")
    ap.add_argument("--merge", action="store_true", help="append rows missing from publish-log.md")
    args = ap.parse_args()

    rows = fetch(args.days)
    if args.merge:
        merge(rows)
        return
    print(json.dumps(rows, indent=2) if args.json else as_markdown(rows))


if __name__ == "__main__":
    main()
