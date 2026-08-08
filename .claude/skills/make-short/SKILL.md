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
     When a beat needs an illustration no real UI can give (a concept, an atmosphere), generate it:
     `python tools/gen_image.py --prompt "..." --model fast --aspect 9:16 --out media/projects/short-NNN/x.png`
     (Nano Banana 2 for drafts/in-video art; `--model pro` = Nano Banana Pro only when the image
     carries the beat). Real tool UI still beats generated art for tool claims — prefer the clone.
   - Add `<Watermark />` (+ `<ProgressBar />`) — persistent channel branding on every frame is
     part of the originality defense. Pass `src='library/logos/<channel-mark>.png'` once a real
     logo exists in `media/library/logos/`; with no src it renders the `brand.ts` wordmark.
   - Keep primary content inside `SAFE` — the Shorts UI covers the bottom ~460px and right edge.
   - **Seamless loop + frame-0 thumbnail:** design the LAST beat to visually resolve into the
     hook layout so the replay is invisible (frame 0 ≈ final frame), and make frame 0 carry the
     full payoff statement — YouTube uses it as the de-facto thumbnail in the Shorts feed.
     Reference craft: hassancs91/claude-faceless-shorts-creator (12 worked TSX productions).
   - **⚠ CUSTOM SHORTS THUMBNAILS ARE GATED BEHIND THE YOUTUBE PARTNER PROGRAM.** Root-caused
     2026-08-08 on the live channel: `channels.list(part=status)` returned
     `isChannelMonetizationEnabled: false`, and every published Short displayed a mid-video
     frame — via the API AND after a manual Studio upload. `thumbnails.set` returns 200 and
     YouTube *stores* the image (it fetches back from the CDN at 1280×720), but a non-YPP
     channel's Shorts render a VIDEO FRAME everywhere. Do not read a successful attach, or a
     successful CDN fetch, as "the thumbnail is live" — it is stored, not shown.
     **Until YPP, the video's frames ARE the thumbnail.** Keep attaching thumbnails anyway
     (fractions of a cent, and they activate automatically on YPP entry), but put the design
     effort in the frames. The only creator control today is the YouTube MOBILE app →
     Short → Edit → **Cover** → pick a frame; that works off-YPP and is worth 30 seconds on
     any Short that starts performing.
     **So every frame must be shelf-worthy, and the opening must be a designed cover:**
     1. **Hold the cover — three props, all required together.** Frames 0–24 (~0.8s) render the
        FULL cover: art + the complete payoff headline, static, with nothing else on top.
        `<CoverImage src=… out={HOOK_OUT}/>` + `<HookTitle hold onDark …/>` +
        `<CaptionTrack startAt={24} …/>` (the default). Each exists for a defect seen in a
        shipped video: without `hold` the headline is caught mid-rise with lines overlapping;
        without `onDark` the non-accent line renders near-black on dark art and vanishes;
        without `startAt` a burned-in caption cuts across the poster. Verify frame 0 by eye.
     2. **Every beat is a candidate.** A tool card mid-video may be what the shelf shows, so
        each beat must read as a poster on its own: name + payoff line visible, nothing
        clipped, no lone caption word on an empty background.
     3. **Loop back to it.** The final beat resolves into the cover layout, so the last frame
        is also a designed frame.
     The only *guaranteed* control is manual: the YouTube mobile app's **Edit cover** picker
     (Shorts → edit → cover) — worth 30 seconds on a video that over-performs.
   - **Generated-image QA — trademark check:** image models hallucinate real brand marks (an
     NVIDIA logo appeared on a chip during testing). Reject any render containing a third-party
     logo or brand name; regenerate with the brand named in the negative list.
   - **The cover frame (mandatory):** Shorts can't have uploaded thumbnails, so frame 0 IS the
     thumbnail — make it thumbnail-grade. Generate ONE dramatic backdrop per Short:
     `python tools/gen_image.py --prompt "<single bold subject matching the hook, cinematic
     light, high contrast, emerald/gold palette accents, NO text, no watermarks>" --model fast
     --aspect 9:16 --out media/projects/short-NNN/cover.png`, then layer
     `<CoverImage src='projects/short-NNN/cover.png' out={HOOK_OUT} />` UNDER `HookTitle` for
     the hook, and bring it back at the loop point (`at={CTA}`) so last frame = first frame.
     Text never lives in the image — `HookTitle` renders it in brand type. QA the actual frame 0
     still: payoff readable at feed size? subject visible? then it ships. (`--model pro` only
     when a video is a big bet.)

4. **Register + render.** From the repo root:
   ```
   cd remotion && npm run gen && npx remotion render ShortNNN out/short-NNN-video.mp4 && cd ..
   ```

5. **Mux the voiceover** (video renders silent; the mp3 is the audio track). Re-encode — don't
   stream-copy: Remotion's jpeg pipeline emits full-range `yuvj420p`, which some players refuse,
   and `+faststart` is what lets browsers start playback before the download finishes:
   The `loudnorm` pass matters: TTS output level varies run to run, and Shorts compete at
   ~-14 LUFS — a quiet voice reads as low quality before a single word registers.
   ```
   ffmpeg -y -i remotion/out/short-NNN-video.mp4 -i videos/short-NNN/work/voiceover/voiceover.mp3 \
     -map 0:v:0 -map 1:a:0 -c:v libx264 -profile:v high -pix_fmt yuv420p -preset fast -crf 20 \
     -af loudnorm=I=-14:TP=-1.5:LRA=11 \
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
   - **Shelf gate (because the shelf picks its own frame):** sample the final mp4 at
     **0s, 25%, 50%, 75% and the last frame** and ask of each one — *would this work as the
     tile someone sees on the channel page?* Any frame that is mid-transition, half-faded, or
     shows a lone caption word on empty background is a defect: retime that beat so the
     composition holds. Do not ship until all five sampled frames are poster-worthy.

7. **Author `videos/short-NNN/publish.json`** — the upload plan `tools/yt_upload.py` consumes:
   ```json
   {
     "video": "videos/short-NNN/output/short-NNN.mp4",
     "title": "<from metadata.md>",
     "description": "<from metadata.md — include #Shorts and the disclosure line>",
     "tags": ["ai", "ai tools"],
     "privacy": "private",
     "publishAt": "<next free slot: python tools/next_slot.py>"
   }
   ```
   `publishAt` comes from `tools/next_slot.py` (the strategy §4 slots, DST-aware, skipping slots
   other plans claimed). YouTube holds the video PRIVATE and flips it public at that moment — so
   the human review gate stays intact: upload early, review any time before the slot, pull the
   `publishAt` in Studio if it shouldn't ship. On an unaudited API project YouTube may ignore
   API-set publishAt — then the schedule is set with one click in Studio from the same plan.
7b. **Thumbnail — VERTICAL, brand type set in Remotion (never in the image model).**
   Verified behaviour: YouTube normalises every custom thumbnail to 16:9, letterboxing a 9:16
   upload with a blurred fill of its own art — so a vertical design shows perfectly in the
   Shorts tab / vertical tiles AND stays readable in 16:9 surfaces. Vertical is the house format.
   ```
   # 1. art only — the model must render NO text (it garbles words and hallucinates brand logos)
   ./venv/bin/python tools/gen_image.py --aspect 9:16 \
     --prompt "<subject in the LOWER TWO THIRDS, empty dark space at top>, dramatic studio light,
       high contrast, emerald/gold accents, dark charcoal bg, film grain.
       Absolutely NO text, NO letters, NO numbers, NO logos, NO brand names." \
     --out media/projects/short-NNN/thumb-art.png
   # 2. Remotion sets the type + the ToolMint mark (1440x2560, crisp brand fonts, never misspelled)
   cd remotion && npx remotion still ShortThumbnail --browser-executable=<headless shell> \
     ../videos/short-NNN/packaging/thumb-v.png \
     --props='{"art":"projects/short-NNN/thumb-art.png","line1":"TWO WORDS","line2":"PAYOFF","accent":"line2"}'
   # 3. PNG -> JPG under YouTube's 2MB cap (PIL, quality 95 down until it fits), then attach
   ```
   Headline: 2–4 words per line, max 2 lines, the accent line carries the money word — it must be
   readable at ~120px tall. **QA the render**: read it back; reject any third-party logo the art
   model hallucinated (an NVIDIA mark appeared during testing) and regenerate with that brand in
   the negative list.
8. **Upload the draft** (only when asked, or the user pre-authorized the day's batch):
   ```
   venv/Scripts/python tools/yt_upload.py upload videos/short-NNN/publish.json --dry-run   # preview
   venv/Scripts/python tools/yt_upload.py upload videos/short-NNN/publish.json             # real
   ```
   It prints the Studio link — that link is what goes to the owner for approval. **Private always**
   until the owner approves — the review gate is the demonetization firewall (strategy §4).
9. **Append the ledger row** — add this Short to `videos/publish-log.md` (date, project, video id
   from the upload output, title, format, topic, publishAt slot, notes) and mirror the video id
   into `script/metadata.md`. The ledger is the channel's cross-session memory: dedup, stats,
   and the weekly recap all read it. An upload without a ledger row is an unfinished step 8.

## Output layout

```
videos/short-NNN/
├─ script/                       (from /write-short)
├─ work/voiceover/               voiceover.mp3 + words.json   (git-ignored, regenerable)
└─ output/short-NNN.mp4          the final vertical master    (git-ignored)
remotion/src/shots/short-NNN/    ShortNNN.tsx + words.ts      (committed — the reproducible part)
```
