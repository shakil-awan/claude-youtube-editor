# publish-log.md — the channel ledger

One row per uploaded Short, appended by `/make-short` at upload time (step 8) and completed when
the video ID is known. This file is the **channel's memory across sessions**: `/write-short` checks
it (with the research docs) for 14-day topic dedup, `/shorts-report` reads it as the definitive
list of what to pull stats for, and the weekly recap builds from it. Chat sessions are ephemeral —
this repo is what remembers. Never delete rows; corrections edit in place.

| date | project | video id | title | format | topic | publishAt slot | notes |
|---|---|---|---|---|---|---|---|
| 2026-08-07 | short-002 | okUWYDWq0z0 | This AI Costs 14 Cents Per Million Tokens | news-jack | DeepSeek V4 Flash pricing | 2026-08-07T15:00:00Z | **CHANNEL'S FIRST PUBLIC VIDEO.** From the first automated batch. 16 views at +10h. Vertical branded thumbnail attached. |
| 2026-08-07 | short-003 | Nepl7Jwjdk0 | 3 Free Tools That Run Your Business For You | listicle | Microsoft Clarity, Otter.ai, + 1 | 2026-08-07T21:00:00Z | Same batch. Published +4h, 1 view at check. Vertical branded thumbnail attached. |
| 2026-08-07 | short-001 | T08Tm92yv0E | You Are Overpaying for AI: Use These 3 Tools Instead #ai #tech #shorts | listicle | free tools: NotebookLM, AI Studio, ElevenLabs | 2026-08-08T15:00:00Z | First upload built by hand in-session; title edited in Studio post-upload (API-confirmed). Scheduled, still private at 2026-08-08T01:14Z. |

**Baseline for `/shorts-report`** — first-week numbers are a cold start on an 11-subscriber
channel, not a verdict on the niche. Grade the trend across ~10 videos (NICHE-STRATEGY.md §7),
never a single video's first day.
