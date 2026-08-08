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
| 2026-08-08 | short-004* | qIhWADBgNFc | ChatGPT's $20 Plan Just Became Free | news-jack | GPT-5.6 Luna free default | 2026-08-08T21:00:00Z | Batch #2. Branded vertical thumbnail VERIFIED on CDN ("$20 PLAN / NOW FREE"). *Repo artifacts stranded in the batch session — push blocked again; rows reconstructed from the API. |
| 2026-08-08 | short-005* | SrrorDG0X6Y | Skip The $20 AI Subscription — This Tool Is Free | replacement | Ollama local models | 2026-08-09T15:00:00Z | Batch #2. Branded vertical thumbnail VERIFIED on CDN ("$20 A MONTH / OR JUST $0"). Same stranded-artifacts note; GH_PAT push fix shipped after this run. |

| 2026-08-08 | short-006* | _fMOv_Rq780 | Meta's New AI Coder Is 20x Cheaper (Here's The Catch) | news-jack | Meta Muse Code pricing | 2026-08-09T21:00:00Z | Manual proof run. Artifacts stranded — push failed. |
| 2026-08-08 | short-007* | yEWBIrooLmM | 3 Free AI Tools That Replace $50 a Month in Subscriptions | listicle | GitHub Copilot, HubSpot CRM, Zapier | 2026-08-10T15:00:00Z | Manual proof run. **NEAR-DUPLICATE of short-008** — dedup failed because the ledger never persisted. |
| 2026-08-08 | short-008* | -AFOdq8pZxk | 3 Free AI Tools That Save You $30+ a Month | listicle | free-tool savings | 2026-08-10T21:00:00Z | Manual proof run. **NEAR-DUPLICATE of short-007** — pick ONE, unschedule the other. |
| 2026-08-08 | short-009* | KyJD6tZ8bSE | Zapier vs Make: Which Free Automation Plan Wins? | versus | Zapier vs Make free tiers | 2026-08-11T15:00:00Z | Manual proof run. First `versus` format on the channel. |

`*` = project number reconstructed from the YouTube API, not from repo artifacts: these runs
could not push (see below), so their scripts/shots/research docs exist only in their own expired
sessions. The video IDs and slots are authoritative; the project folders do not exist in git.

**⚠ THE PUSH FAILURE IS NOT COSMETIC — IT BREAKS DEDUP.** This ledger is the 14-day topic memory
`/write-short` reads. When a batch cannot push, the next batch starts blind and re-covers the same
ground: short-007 and short-008 are the same idea, scheduled 6 hours apart. Repetitious content is
the single named risk in NICHE-STRATEGY.md §5. **A batch that cannot push must be treated as a
failed batch**, not a partial success.

**Baseline for `/shorts-report`** — first-week numbers are a cold start on an 11-subscriber
channel, not a verdict on the niche. Grade the trend across ~10 videos (NICHE-STRATEGY.md §7),
never a single video's first day.
