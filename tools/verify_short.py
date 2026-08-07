#!/usr/bin/env python3
"""
verify_short.py — the pre-upload self-check for a produced Short (the Shorts verify_cut.py).

Run on every final mux BEFORE yt_upload.py — /make-short's QA gate calls this. Checks the
things that silently ruin a Short:

  • container:   file exists, video stream present, H.264-compatible pixel data
  • format:      exactly 1080×1920 (vertical), ~30 fps
  • duration:    < 60s HARD (YouTube's Short cutoff; 59.5s+ fails), warns under 15s
  • audio:       an audio stream exists (Remotion renders silent video — a missing mux
                 is the classic failure), audio and video durations match within 0.5s
  • levels:      peak below -0.5 dBFS (clipping), warns if peak < -12 dBFS (too quiet)
  • captions:    if work/voiceover/words.json exists, the last word must end inside the
                 video (captions running past the video = A/V drift or a bad words.ts copy)

Usage (from the repo root):
  python tools/verify_short.py videos/short-001                          # checks output/short-001.mp4
  python tools/verify_short.py videos/short-001 --file output/alt.mp4    # explicit file

Exit code 0 = pass (warnings allowed), 1 = at least one hard failure. ffprobe/ffmpeg on PATH.
"""
import argparse
import json
import os
import re
import subprocess
import sys


def ffprobe_json(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def measure_peak_db(path):
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-map", "0:a:0", "-af", "volumedetect", "-f", "null", os.devnull],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout
    m = re.search(r"max_volume:\s*(-?[\d.]+) dB", out)
    return float(m.group(1)) if m else None


def main():
    ap = argparse.ArgumentParser(description="Verify a produced Short before upload.")
    ap.add_argument("project", help="project dir, e.g. videos/short-001 (run from the repo root)")
    ap.add_argument("--file", help="video file relative to the project (default output/<name>.mp4)")
    args = ap.parse_args()

    name = os.path.basename(os.path.normpath(args.project))
    video = os.path.join(args.project, args.file) if args.file else os.path.join(args.project, "output", f"{name}.mp4")

    fails, warns = [], []

    if not os.path.exists(video):
        sys.exit(f"FAIL: {video} does not exist — run the render + mux first (/make-short).")

    info = ffprobe_json(video)
    if not info or "streams" not in info:
        sys.exit(f"FAIL: ffprobe could not read {video} — corrupt or truncated render.")

    v = next((s for s in info["streams"] if s.get("codec_type") == "video"), None)
    a = next((s for s in info["streams"] if s.get("codec_type") == "audio"), None)

    if v is None:
        fails.append("no video stream")
    else:
        w, h = v.get("width"), v.get("height")
        if (w, h) != (1080, 1920):
            fails.append(f"resolution {w}x{h} — Shorts must be 1080x1920 vertical")
        try:
            num, den = v.get("avg_frame_rate", "0/1").split("/")
            fps = float(num) / float(den) if float(den) else 0.0
            if abs(fps - 30.0) > 0.6:
                warns.append(f"frame rate {fps:.2f} (expected ~30)")
        except (ValueError, ZeroDivisionError):
            warns.append("could not parse frame rate")
        # full-range yuvj420p (Remotion's jpeg pipeline default) breaks some browser players —
        # the /make-short mux re-encodes to yuv420p; a stream-copied mux skips that fix.
        if v.get("pix_fmt") not in (None, "yuv420p"):
            fails.append(f"pixel format {v.get('pix_fmt')} — re-encode the mux to yuv420p "
                         "(+faststart) per /make-short step 5; some players won't play this")

    duration = float(info.get("format", {}).get("duration", 0.0))
    if duration >= 59.5:
        fails.append(f"duration {duration:.2f}s — must stay under 60s to be a Short (target 30-45s)")
    elif duration < 15:
        warns.append(f"duration {duration:.2f}s — very short; under ~15s hurts monetized watch time")

    if a is None:
        fails.append("NO AUDIO STREAM — the voiceover mux was skipped (Remotion renders silent video)")
    else:
        a_dur = float(a.get("duration") or duration)
        v_dur = float(v.get("duration") or duration) if v else duration
        # /make-short renders video = voiceover + ~0.5s tail on purpose (the last word
        # shouldn't hard-cut). So: a small video tail is correct; audio outliving the
        # video, or a tail well past the intended 0.5s, is drift.
        if a_dur - v_dur > 0.05:
            fails.append(f"audio outlives the video: audio {a_dur:.2f}s vs video {v_dur:.2f}s — narration gets cut")
        elif v_dur - a_dur > 0.8:
            fails.append(f"video tail too long: video {v_dur:.2f}s vs audio {a_dur:.2f}s (intended tail is ~0.5s)")
        peak = measure_peak_db(video)
        if peak is None:
            warns.append("could not measure audio peak")
        elif peak > -0.5:
            fails.append(f"audio peak {peak:.1f} dBFS — clipping (re-mux with lower gain)")
        elif peak < -12:
            warns.append(f"audio peak {peak:.1f} dBFS — quiet; consider normalizing toward -1.5 dBFS")

    words_path = os.path.join(args.project, "work", "voiceover", "words.json")
    if os.path.exists(words_path):
        try:
            words = json.load(open(words_path, encoding="utf-8")).get("words", [])
            if words and duration and words[-1]["end_s"] > duration + 0.05:
                fails.append(f"captions outlive the video: last word ends {words[-1]['end_s']:.2f}s, "
                             f"video is {duration:.2f}s — words.ts stale or duration too short")
        except (json.JSONDecodeError, KeyError, TypeError):
            warns.append("words.json unreadable — caption coverage not checked")
    else:
        warns.append("no words.json — caption coverage not checked")

    print(f"verify_short: {video} ({duration:.2f}s)")
    for f in fails:
        print(f"  FAIL  {f}")
    for w in warns:
        print(f"  warn  {w}")
    if not fails and not warns:
        print("  all checks passed")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
