---
name: make-short
description: Step S2 of the Shorts pipeline — turn a scripted videos/short-NNN project into a finished vertical video: ElevenLabs voiceover with word timestamps (tools/gen_voiceover.py), a 1080×1920 Remotion shot with word-synced captions built on remotion/src/lib/shorts.tsx, render, audio mux, frame QA, and an optional private-draft upload. Use when the user wants to "make the short", "produce short-NNN", "render the short", "voice + captions for this script", or take a /write-short output to a finished MP4. Defers raw crash-free TSX rules to /vidtsx-2d-generator (vertical preset), UI walkthrough proof-slots to /fake-screencast, and scripting to /write-short. Not for long-form (that is /clean-cut → /make-tsx).
---

# make-short — voice, visuals, render (Shorts step S2)

Takes a `videos/short-NNN/` project with a finished script and produces the final vertical MP4.
The order is fixed: **voice first** — the voiceover's word timestamps are the master clock every
visual syncs to, exactly like `edited-transcript.json` is for long-form. Never animate first and
hope the voice fits.

## Inputs

- **`videos/short-NNN/script/`** — from `/write-short`: `short.md` (beats + visual intent),
  `narration.txt` (the spoken words), `metadata.md` (title/description/hashtags).
- **`remotion/src/lib/shorts.tsx`** — the vertical kit: `SHORT` (1080×1920×30), `SAFE` insets
  (Shorts UI chrome), `CaptionTrack`, `HookTitle`, `CountBadge`, `ToolCard`, `secToFrame`.
- **`remotion/src/shots/shorts-demo/ShortListicleDemo.tsx`** — the worked example. Read it before
  authoring your first short; it is the pattern to copy.
- **`brand.md`** — palette/motion/type contract, same as every pipeline.

## Workflow

1. **Voiceover.** From the repo root, on the venv:
   ```
   venv/Scripts/python tools/gen_voiceover.py videos/short-NNN     # ./venv/bin/python on macOS/Linux
   ```
   → `work/voiceover/voiceover.mp3` + `work/voiceover/words.json`. **Listen-check:** if the TTS
   mangles a tool name, respell it phonetically in `narration.txt` and regenerate before building
   any visuals. Duration must be ≤ 58s (the tool warns).

2. **Words into the shot.** Copy the `words` array from `words.json` into
   `remotion/src/shots/short-NNN/words.ts` as
   `export const WORDS = [...] as const;` — the shot stays standalone and committed (the repo
   carries the reproducible pipeline; mp3s are regenerable and git-ignored).

3. **Author the shot** — ONE file, `remotion/src/shots/short-NNN/ShortNNN.tsx`:
   - `compositionConfig`: 1080×1920, fps 30, `durationInSeconds` = voiceover duration + 0.5 tail.
   - Follow the demo's shape: `ShortBg` → hook (`HookTitle`) → beats (`CountBadge` + `ToolCard`,
     each wrapped for fade-out handoff) → CTA → `CaptionTrack words={WORDS}` on top.
   - **Sync beats to the words**: beat boundaries come from `words.json` times via `secToFrame`
     (the frame the narration says "Number two" is when card two enters). Never eyeball timing.
   - **Proof slots**: `ToolCard`'s children take the visual evidence — a `/fake-screencast`
     walkthrough, a `lib/browser.tsx`/`vscode.tsx` clone, a logo from `media/library/`. This slot
     is the channel's moat (strategy §5: original generated visuals, not stock) — never leave every
     card text-only. Raw TSX rules: `/vidtsx-2d-generator` (vertical preset, safe areas §layout).
   - Keep primary content inside `SAFE` — the Shorts UI covers the bottom ~460px and right edge.

4. **Register + render.** From the repo root:
   ```
   cd remotion && npm run gen && npx remotion render ShortNNN out/short-NNN-video.mp4 && cd ..
   ```

5. **Mux the voiceover** (video renders silent; the mp3 is the audio track). Re-encode — don't
   stream-copy: Remotion's jpeg pipeline emits full-range `yuvj420p`, which some players refuse,
   and `+faststart` is what lets browsers start playback before the download finishes:
   ```
   ffmpeg -y -i remotion/out/short-NNN-video.mp4 -i videos/short-NNN/work/voiceover/voiceover.mp3 \
     -map 0:v:0 -map 1:a:0 -c:v libx264 -profile:v high -pix_fmt yuv420p -preset fast -crf 20 \
     -c:a aac -b:a 192k -movflags +faststart videos/short-NNN/output/short-NNN.mp4
   ```
   Optional polish before the mux, same as long-form: `/suggest-sfx` for 2–3 cues on the biggest
   beats, a quiet music bed via `tools/mix_music.py`. Taste per `brand.md` §10 — under the voice, always.

6. **QA — not optional.** Two gates, both must pass:
   - **Machine gate:** `python tools/verify_short.py videos/short-NNN` — verifies 1080×1920,
     under 60s, audio present (the classic missed-mux), A/V durations (video = voiceover +
     ~0.5s tail), peak levels, captions not outliving the video. Exit 0 required.
   - **Eye gate:** extract frames from the FINAL mp4 (`ffmpeg -ss <t> -i .../short-NNN.mp4
     -frames:v 1 <scratch>/f.png`) at the hook, each beat's landing, and one mid-caption moment,
     and **READ them**: hook legible in 1.5s? captions inside SAFE? proof slot actually proving?
     Stills go in a scratch dir, never the project.

7. **Upload as a private draft** (only when asked, or the user pre-authorized the day's batch):
   ```
   venv/Scripts/python tools/yt_upload.py videos/short-NNN/output/short-NNN.mp4 \
     --title "<from metadata.md>" --description-file <(see metadata.md) --privacy private
   ```
   Check `tools/yt_upload.py --help` for exact flags. **Private always** — the human review gate
   before anything goes public is the demonetization firewall (strategy §4).

## Output layout

```
videos/short-NNN/
├─ script/                       (from /write-short)
├─ work/voiceover/               voiceover.mp3 + words.json   (git-ignored, regenerable)
└─ output/short-NNN.mp4          the final vertical master    (git-ignored)
remotion/src/shots/short-NNN/    ShortNNN.tsx + words.ts      (committed — the reproducible part)
```
