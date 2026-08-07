#!/usr/bin/env python3
"""
gen_voiceover.py — narration for the Shorts pipeline: text -> ElevenLabs TTS -> mp3 + word times.

The Shorts pipeline runs the long-form pipeline BACKWARDS: there is no footage to transcribe —
the script comes first, the voice is generated, and the word timestamps drive the visuals.
This tool is that step. It calls the ElevenLabs text-to-speech WITH-TIMESTAMPS endpoint, decodes
the audio, and converts the character-level alignment into word-level times — the same role
edited-transcript.json plays for long-form, so /make-short can sync captions and beats to speech.

Outputs (in <project>/work/voiceover/):
  voiceover.mp3   the narration audio
  words.json      {"text", "voice_id", "model_id", "duration_s",
                   "words": [{"word", "start_s", "end_s"}, ...]}
                  -> remotion/src/lib/shorts.tsx CaptionTrack reads exactly this words shape.

Usage (from the repo root — project paths resolve against CWD):
  python tools/gen_voiceover.py videos/short-001                    # reads script/narration.txt
  python tools/gen_voiceover.py videos/short-001 --text "..."       # inline text instead
  python tools/gen_voiceover.py videos/short-001 --voice <VOICE_ID> --model eleven_turbo_v2_5

Voice resolution order: --voice flag > ELEVENLABS_VOICE_ID in .env > "Adam" (premade).
Needs ELEVENLABS_API_KEY in .env (see .env.example). ffprobe on PATH (duration check).
"""
import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps"
DEFAULT_VOICE = "TX3LPaxmHKxFdv7VOQHJ"  # ElevenLabs "Liam" — ToolMint's locked brand voice (brand.md §1); override via ELEVENLABS_VOICE_ID
DEFAULT_MODEL = "eleven_multilingual_v2"


def load_env():
    """Minimal .env reader so we don't depend on python-dotenv."""
    env = {}
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return {**env, **os.environ}


def probe_duration(path):
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", path],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True).stdout.strip()
        return round(float(out), 3)
    except (ValueError, OSError):
        return None


def chars_to_words(chars, starts, ends):
    """Group ElevenLabs character alignment into word-level times. Whitespace splits words;
    punctuation stays attached to its word (that is how captions should read)."""
    words, buf, w_start, w_end = [], [], None, None
    for ch, s, e in zip(chars, starts, ends):
        if ch.isspace():
            if buf:
                words.append({"word": "".join(buf), "start_s": round(w_start, 3), "end_s": round(w_end, 3)})
                buf, w_start, w_end = [], None, None
            continue
        if not buf:
            w_start = s
        buf.append(ch)
        w_end = e
    if buf:
        words.append({"word": "".join(buf), "start_s": round(w_start, 3), "end_s": round(w_end, 3)})
    return words


def read_narration(project, explicit_path):
    path = os.path.join(project, explicit_path) if explicit_path else os.path.join(project, "script", "narration.txt")
    if not os.path.exists(path):
        sys.exit(f"No narration found at {path} — write the script first (/write-short) or pass --text.")
    text = open(path, encoding="utf-8").read()
    # narration.txt is plain spoken text; collapse whitespace so alignment maps cleanly
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        sys.exit(f"{path} is empty.")
    return text


def main():
    ap = argparse.ArgumentParser(description="Generate ElevenLabs voiceover + word times for a Short.")
    ap.add_argument("project", help="project dir, e.g. videos/short-001 (run from the repo root)")
    ap.add_argument("--text", help="inline narration text (otherwise reads <project>/script/narration.txt)")
    ap.add_argument("--script", help="narration file relative to the project (default script/narration.txt)")
    ap.add_argument("--voice", help="ElevenLabs voice id (default: ELEVENLABS_VOICE_ID in .env, else premade Adam)")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"TTS model id (default {DEFAULT_MODEL}; eleven_turbo_v2_5 is faster/cheaper)")
    ap.add_argument("--stability", type=float, default=0.5)
    ap.add_argument("--similarity", type=float, default=0.75)
    args = ap.parse_args()

    env = load_env()
    api_key = env.get("ELEVENLABS_API_KEY")
    if not api_key:
        sys.exit("ELEVENLABS_API_KEY missing — copy .env.example to .env and fill it in.")
    voice_id = args.voice or env.get("ELEVENLABS_VOICE_ID") or DEFAULT_VOICE

    text = args.text.strip() if args.text else read_narration(args.project, args.script)
    n_words = len(text.split())
    print(f"narration: {n_words} words (~{n_words / 2.6:.0f}s at Shorts pace) | voice {voice_id} | {args.model}")

    body = json.dumps({
        "text": text,
        "model_id": args.model,
        "voice_settings": {"stability": args.stability, "similarity_boost": args.similarity},
    }).encode("utf-8")
    req = urllib.request.Request(
        API_URL.format(voice_id=voice_id) + "?output_format=mp3_44100_128",
        data=body, method="POST",
        headers={"xi-api-key": api_key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs API error {e.code}: {e.read().decode('utf-8', 'replace')[:500]}")

    align = payload.get("alignment") or payload.get("normalized_alignment")
    if not payload.get("audio_base64") or not align:
        sys.exit("Unexpected API response — no audio_base64/alignment. Check the model supports timestamps.")

    out_dir = os.path.join(args.project, "work", "voiceover")
    os.makedirs(out_dir, exist_ok=True)
    mp3_path = os.path.join(out_dir, "voiceover.mp3")
    with open(mp3_path, "wb") as f:
        f.write(base64.b64decode(payload["audio_base64"]))

    words = chars_to_words(align["characters"],
                           align["character_start_times_seconds"],
                           align["character_end_times_seconds"])
    duration = probe_duration(mp3_path) or (words[-1]["end_s"] if words else 0.0)

    words_path = os.path.join(out_dir, "words.json")
    with open(words_path, "w", encoding="utf-8") as f:
        json.dump({"text": text, "voice_id": voice_id, "model_id": args.model,
                   "duration_s": duration, "words": words}, f, indent=2)

    print(f"wrote {mp3_path} ({duration}s)")
    print(f"wrote {words_path} ({len(words)} words)")
    if duration and duration > 58:
        print("WARNING: over 58s — trim the script; Shorts must stay under 60s (target 30-45s).")


if __name__ == "__main__":
    main()
