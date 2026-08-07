---
name: weekly-recap
description: Turn the week's published Shorts into one long-form YouTube video — "the N AI tools that mattered this week" — re-rendered horizontal (1920×1080) from the same shot components with fresh bridging narration, packaged via /packaging, scheduled like any upload. Use when the user wants the "weekly recap", "week update video", "compile this week's shorts", or a long-form rollup. Needs ≥ 12 ledger rows (2 weeks) before the first run. Long-form is the high-RPM layer: 10–30× Shorts RPM. Not a Shorts compilation stitch — beats are re-authored horizontal, never letterboxed vertical clips.
---

# weekly-recap — the week's Shorts as one proper long-form video

The compounding trick: our Shorts are **code, not footage**. A recap is not stitching MP4s — the
week's tool beats re-render at 1920×1080 with long-form pacing and fresh narration bridging them.
Nobody else in the faceless space can do this without re-editing; we re-render.

## Inputs

- **`videos/publish-log.md`** — the week's rows. Pick the top 5–7 tools by views/retention
  (`tools/yt_stats.py` per id). An outlier week can carry 3 minutes on one tool.
- **The week's shot sources** `remotion/src/shots/short-NNN/` — the beats to re-author, and
  `videos/short-NNN/script/short.md` — the claims + sources (re-verify anything time-sensitive).
- **`brand.md`** — long-form delivery specs (§7) apply: 1920×1080 design, overlay captions only.

## Workflow

1. **Curate**: rank the week's tools by performance; pick 5–7; decide an arc (best saved for
   last; open with the week's #1 as a cold hook: "this tool did 300K views this week").
2. **Script** (`videos/recap-NNN/script/`): 5–8 minutes, ~140 wpm. Structure: cold open →
   "this week in one minute" → tool segments (30–60s each: what it does, the money angle, the
   demo, who it's for) → verdict/ranking → CTA to the Shorts channel + affiliate links.
3. **Voice**: `tools/gen_voiceover.py videos/recap-NNN` — same Liam voice, word timestamps drive
   segment timing exactly like a Short.
4. **Visuals**: horizontal shots in `remotion/src/shots/recap-NNN/` — re-author each tool's beat
   from its Short's components (cards/screencasts adapt; captions become lower-thirds per brand
   §7). Defer to /make-tsx conventions for long-form composition and /vidtsx-2d-generator rules.
5. **Assemble + mux** like a Short (same ffmpeg recipe, 1920×1080), QA frames, then
   `tools/verify_short.py videos/recap-NNN --file output/recap-NNN.mp4` for the audio checks
   (ignore its vertical-resolution failure — that check is Shorts-only) and READ frames at each
   segment boundary.
6. **Package**: `/packaging` — full title + 3 thumbnail bets (long-form thumbnails matter, unlike
   Shorts). Upload via publish.json; weekend slot (Sat 11:00 ET) unless learnings say otherwise.
7. **Ledger**: append a `recap` row to `videos/publish-log.md`.

## Cadence

Weekly once the ledger has ≥ 12 Short rows; the natural cron is Saturday morning after Friday's
`/shorts-report` (the report's rankings feed step 1 directly).
