# AUTOMATION.md — running the Shorts engine without touching it

Three layers. Layer 1 is you prompting Claude Code. Layer 2 is Claude Code running on a schedule
with nobody prompting it. Layer 3 is the system improving itself from its own stats. Layers 2–3
are what "automation with automation" means — but the **human review gate stays** at every layer:
uploads land as **private drafts**, and a human flips them public. That 10 minutes/day is the
demonetization firewall (NICHE-STRATEGY.md §4–5). Never wire anything to publish directly.

## Layer 1 — interactive (works today)

```
write today's shorts            → /write-short researches + scripts 2-3 projects
make short videos/short-00N     → /make-short: voice → captions → render → verify → draft
shorts report                   → /shorts-report: stats → learnings.md
```

## Layer 2 — scheduled headless runs

Claude Code has a non-interactive mode: `claude -p "<prompt>"` runs a full agentic session and
exits. Requirements on the machine that runs it: this repo cloned, `claude` authenticated, the
venv built, `.env` filled, `ffmpeg`/`node` on PATH, and YouTube OAuth done once interactively
(`python tools/yt_upload.py auth`).

**The daily batch (cron, weekdays+weekends):**
```cron
# 07:00 local — research, script, produce, upload 2 drafts; write a summary to logs/
0 7 * * * cd /path/to/claude-youtube-editor && claude -p "Run the daily Shorts batch: \
/write-short two shorts from today's research, then /make-short each one, run \
tools/verify_short.py on both, upload both as PRIVATE drafts, and write a one-paragraph \
summary of what was made to logs/daily-$(date +\%F).md" \
--permission-mode acceptEdits >> logs/cron.log 2>&1
```

**The weekly feedback loop (Layer 3's engine):**
```cron
# Sunday 18:00 — pull stats, update learnings.md, propose next week's mix
0 18 * * 0 cd /path/to/claude-youtube-editor && claude -p "/shorts-report — then commit \
learnings.md if it changed" --permission-mode acceptEdits >> logs/cron.log 2>&1
```

Your morning routine is then: open YouTube Studio → review 2 drafts → done. Each draft already
carries a `publishAt` from `tools/next_slot.py` (the strategy §4 slots, DST-aware), so an approved
draft publishes itself at its slot; pull the schedule in Studio if one shouldn't ship. (On an
unaudited API project YouTube may ignore API-set publishAt — then scheduling is one click in
Studio from the same plan.) If a draft is wrong, tell Claude Code what was wrong — that note
belongs in `learnings.md`.

**No server?** Claude Code on the web runs sessions in the cloud against this repo and supports
scheduled recurring tasks (Routines) — same prompts, no cron of your own. A cheap VPS also works;
renders need ~2+ CPU cores (`--concurrency` ≤ cores − 1; the render is the slow step, ~3–6 min
per Short on 4 cores).

## Layer 3 — the self-improvement loop (already wired)

`/shorts-report` (weekly) writes what the channel's own numbers proved into `learnings.md` →
`/write-short` reads it before every script → scripts get measurably better without anyone
editing a prompt. The rules that keep this honest live at the top of `learnings.md` (≥3 videos
of evidence per lesson, citations, strike-through supersession). Quarterly, the report re-checks
the niche's own numbers against NICHE-STRATEGY.md §1 and proposes — never silently applies —
strategy changes.

## Budgets & tripwires (check monthly)

- **ElevenLabs:** one ~90-word Short ≈ 500 credits. Free tier 10k ≈ 20 Shorts/mo; 2/day needs
  the Starter tier. `gen_voiceover.py` prints duration; it warns past 58s.
- **Claude:** the daily batch is one session; watch your plan's usage the first week.
- **Tripwires that stop the cron until a human looks:** `verify_short.py` non-zero, a YouTube
  upload error, or ElevenLabs quota errors — the batch prompt tells Claude to stop and write the
  failure to the daily log rather than improvising around it.

## What stays manual, forever

1. Flipping drafts public (the review gate).
2. Changing `NICHE-STRATEGY.md` (the report proposes; the owner decides).
3. Anything involving money terms — affiliate program signups, sponsor deals.
