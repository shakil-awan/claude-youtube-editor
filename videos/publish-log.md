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
| 2026-08-12 | short-010 | x9sa7gNK0bI | OpenAI Just Cut AI Prices By 80% | news-jack | GPT-5.6 Luna/Terra/Sol price cuts | 2026-08-12T15:00:00Z | Produced by hand in-session after 4 straight cloud batches died at bootstrap; ended the publishing gap. First video through the fixed cover-frame system (held frame 0, onDark title, captions off till f24). |
| 2026-08-12 | short-011 | tKQvmWrm-iA | The Cheaper AI Model Is Also The Better One | versus | Claude Opus 5 vs GPT-5.6 Sol price + access | 2026-08-12T21:00:00Z | Produced in-session. Both gates passed. |
| 2026-08-12 | short-012 | xsdRLTJVMTI | Google Gives You 1.5 Million Free AI Tokens Daily | listicle+number | Google AI Studio free tier | 2026-08-13T15:00:00Z | Produced in-session. **Deliberate test of the learnings.md hypothesis**: a non-news-jack with a hard number in the hook. |
| 2026-08-27 | short-013 | oalvGUdTeeY | Claude Just Cancelled A 50% Price Hike | news-jack | Claude Sonnet 5 pricing made permanent ($2/$10, cancelled Sept 1 hike) | 2026-08-27T15:00:00Z | Cloud batch, from videos/research/2026-08-27.md. Fact-checked live on Anthropic's own pricing docs the same day. Both gates passed. **Row reconstructed on the owner's machine** — the batch produced commit 7a49d5d but the sandbox git proxy refused the push, so the project folder is not in git. |
| 2026-08-27 | short-014 | VrEimwXvzKY | 30 Billion Parameters. Zero Dollars. Forever. | replacement | Meta Muse Glimmer — free 30B open-weight model (Apache 2.0), runs locally on one consumer GPU | 2026-08-27T21:00:00Z | Same batch; chosen partly to close a format-mix gap (replacement was 1/12 of recent Shorts vs the ~15% target). Cover art took 3 attempts (one transient Replicate error, one rejected for hallucinated text). **Row reconstructed on the owner's machine** — same blocked push. |

**⚠ THE PUSH FAILURE IS NOT COSMETIC — IT BREAKS DEDUP.**
`/write-short` reads. When a batch cannot push, the next batch starts blind and re-covers the same
ground: short-007 and short-008 are the same idea, scheduled 6 hours apart. Repetitious content is
the single named risk in NICHE-STRATEGY.md §5. **A batch that cannot push must be treated as a
failed batch**, not a partial success.

**Mitigation added 2026-08-27:** `./venv/bin/python tools/ledger_from_youtube.py` rebuilds this
history from the channel itself — every video, including ones still private and scheduled. A push
failure can no longer make the batch topic-blind. Run it (or `--merge`) at the start of research.

**THE 14-DAY OUTAGE (2026-08-13 .. 2026-08-27).** The channel published nothing between
short-012's slot and short-013's. The cause was not YouTube, not OAuth, and not this ledger:
Claude Code's sandbox permission classifier refused to execute `tools/bootstrap_cloud.sh`
("Blocked by classifier") because the script used indirect expansion over secret names, grepped
`.env`, and put a token in a remote URL. 13 daily batches died in ~4 minutes each, and every one
of them reported SUCCEEDED because the session exited cleanly. Secret handling now lives in
`tools/preflight.py`; the shell layer names no secret. See AUTOMATION.md.

**THE HALF-RATE STRETCH (2026-08-27 .. 2026-08-31).** The channel ran at one video a day against a
2/day policy — 2 on 08-27, none on 08-28, 2 on 08-29, none on 08-30, none queued on 08-31 — and
nothing alarmed. Three separate causes, all fixed on 2026-08-31 (AUTOMATION.md failure modes 5–6):
the 08-30 batch hung on a permission prompt for `tools/preflight.py` and was recorded ABANDONED
after two minutes; the batch prompt asked for a fixed "two shorts" so a dead day was never made up;
and `watchdog.py` passed on one queued video, so a half-empty day printed "WATCHDOG OK". Production
now targets the unfilled slots on the channel (`next_slot.py --fill 2`, which also keeps one day of
buffer so a single dead batch costs nothing), and the watchdog counts against 2/day.

**Baseline for `/shorts-report`** — first-week numbers are a cold start on an 11-subscriber
channel, not a verdict on the niche. Grade the trend across ~10 videos (NICHE-STRATEGY.md §7),
never a single video's first day.
