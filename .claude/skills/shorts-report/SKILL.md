---
name: shorts-report
description: The Shorts feedback loop — pull real performance data for published Shorts (tools/yt_stats.py), grade it against NICHE-STRATEGY.md §7 KPIs, and rewrite learnings.md so /write-short gets smarter every week. Use when the user wants a "shorts report", "how are the shorts doing", "weekly review", "update learnings", "which hooks worked", or to re-validate the niche. Also flags ≥10× outliers for 48h follow-up videos. Runs weekly (or on demand). Not packaging calibration for long-form (that is /packaging's channel-calibration) and not the strategy itself (NICHE-STRATEGY.md changes only on its own re-validation rules).
---

# shorts-report — the weekly feedback loop (Shorts step S3)

The system that gets better every week without being touched: pull the numbers, find what they
prove, write it into `learnings.md` — which `/write-short` reads before every script. Nobody in
the faceless-shorts space closes this loop; closing it is the compounding edge.

## Inputs

- **Published Shorts list** — every `videos/short-NNN/` with an uploaded video id (keep ids in
  `metadata.md` after publishing; if missing, ask the user or check Studio).
- **`tools/yt_stats.py`** — per-video Data API + Analytics API numbers. One-time auth:
  `venv/Scripts/python tools/yt_stats.py auth`. Then per video:
  `venv/Scripts/python tools/yt_stats.py fetch <VIDEO_ID> --json`.
  **CTR/impressions are NOT in the API** (Studio-only) — grade on views + avg % viewed instead;
  if the user pastes Studio CTR numbers, use them.
- **`NICHE-STRATEGY.md` §7** — the KPIs being graded against.
- **`learnings.md`** — the file this skill maintains, per the rules written at its top.

## Workflow

1. **Pull** stats for every published Short (and re-pull the prior weeks' — Shorts often surge late).
2. **Tabulate** in the report: id · title/hook · format · topic · published · views · avg % viewed ·
   likes · comments · subs gained. Compute the week's **median views** and per-format medians.
3. **Grade vs KPIs** (strategy §7): swipe-survival proxy (avg % viewed ≥ 70%), week-over-week trend,
   milestone distance (500 subs + 3M/90d → 1K + 10M/90d).
4. **Find the signal:**
   - **Outliers ≥ 10× median** → name 2 follow-up topics in the same sub-topic, to be scripted
     within 48h (strategy §7). Say exactly what to make.
   - **Hooks:** compare first-line patterns of the top vs bottom third.
   - **Formats/pacing:** listicle vs news-jack vs replacement medians; beats-per-short vs retention.
   - **Publishing:** slot performance (11:00 vs 17:00 ET).
5. **Update `learnings.md`** — per its own rules: a lesson needs **≥ 3 videos** of evidence, cites
   its videos, supersedes by strike-through. Never rewrite the file's rules or gut its history.
6. **Deliver the report** to the user: the table, the lessons added/retired, the 48h follow-ups,
   and next week's topic mix (format percentages from strategy §2, adjusted by what the data says).

## Cadence + escalation

- **Weekly** — more often is noise (Shorts numbers move for days after publish).
- **Quarterly** (or when growth stalls per strategy §7): re-validate the niche data itself —
  keyword volume/VPH trend and fresh Shorts outliers (vidIQ MCP tools if connected, else web
  research) — and report whether NICHE-STRATEGY.md §1's numbers still hold. Propose strategy
  edits to the user; do NOT silently rewrite the strategy contract.
- If after 60 days / ~100 Shorts the median is under 1K views, invoke strategy §7's re-examination
  order: format first, niche only after two failed cycles. Present the evidence, let the owner call it.
