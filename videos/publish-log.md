# publish-log.md — the channel ledger

One row per uploaded Short, appended by `/make-short` at upload time (step 8) and completed when
the video ID is known. This file is the **channel's memory across sessions**: `/write-short` checks
it (with the research docs) for 14-day topic dedup, `/shorts-report` reads it as the definitive
list of what to pull stats for, and the weekly recap builds from it. Chat sessions are ephemeral —
this repo is what remembers. Never delete rows; corrections edit in place.

| date | project | video id | title | format | topic | publishAt slot | notes |
|---|---|---|---|---|---|---|---|
| 2026-08-07 | short-001 | T08Tm92yv0E | You Are Overpaying for AI: Use These 3 Tools Instead #ai #tech #shorts | listicle | free tools: NotebookLM, AI Studio, ElevenLabs | 2026-08-08T15:00:00Z | first channel upload; title edited in Studio post-upload (API-confirmed); schedule held via API |
