---
name: write-short
description: Step S1 of the Shorts pipeline — research today's AI-tool topics and write a faceless Short's script, hook-first, fact-checked, in the niche NICHE-STRATEGY.md locks in. Use when the user wants to "write a short", "script today's shorts", "find topics for shorts", "research AI tools to cover", "write 2-3 shorts for today", or start a new videos/short-NNN project. Produces script/short.md + script/narration.txt + script/metadata.md for /make-short to consume. Reads NICHE-STRATEGY.md (the niche contract) and learnings.md (what our own data proved) before every script. Not the production step (that is /make-short) and not long-form packaging (that is /packaging).
---

# write-short — research + script (Shorts step S1)

The Shorts pipeline runs the long-form pipeline backwards: **no footage exists — the script is the
master.** Everything downstream (voice, captions, beats) is generated from what this skill writes,
so a weak or unverified script cannot be fixed later. Scripts are cheap; renders are not.

## Inputs (read these first, every session)

- **`NICHE-STRATEGY.md`** — the niche contract: the 4 formats (§2), hook rules (§2), the affiliate
  rule (§3), cadence + title/hashtag rules (§4), originality policy (§5). Non-negotiable.
- **`learnings.md`** — what OUR channel's data has proven. When it contradicts the strategy's
  defaults, learnings win.
- **Web research (fresh, today)** — this niche is news-sensitive; research is daily, not per-video.

## Workflow

1. **Research the day** (once, then script 2–3 Shorts from it). Hunt in order:
   - **News-jacks (best when found):** AI tool launches/updates in the last 24–48h — search
     "<big lab> release", "new AI tool launch", Product Hunt AI leaderboard, changelog pages of
     the big tools. A real launch beats any evergreen topic.
   - **Evergreen listicles:** free/cheap tools around one money outcome (save $X on Y, automate Z).
   - **Replacements/versus:** "paid tool X vs free tool Y" where the claim is honestly defensible.
2. **Pick topic + format** per the strategy §2 mix (listicle ~60%, news-jack when one exists,
   replacement, versus). Check `learnings.md` for hooks/topics to favor or avoid.
3. **Fact-check gate (hard).** Every claim about a tool — pricing, free tier, feature, platform —
   verified against the tool's OWN site/docs today. One fabricated feature kills channel trust
   (strategy §5). Record the source URL per claim in `short.md`.
4. **Write the script.** Structure:
   - **Hook (≤ 12 words):** number + "free" (when true) + money outcome. Stated in the first
     spoken line AND designed to appear on screen at 0s.
   - **Beats:** one tool ≈ 2 sentences — *name → what it does for your wallet → the specific
     number/use-case.* 3–5 beats for a listicle.
   - **CTA (one line):** "Follow for daily AI tools" family. No begging, no double CTAs.
   - **Length:** 80–120 words ≈ 30–45s at ~2.6 words/s. Never past 150 words (60s wall).
   - Write for the EAR: short sentences, no parentheticals, numbers as words ("thirty", not "30")
     when the TTS should speak them naturally.
5. **Affiliate pass** (strategy §3): if a covered tool has an affiliate program, note it in
   `metadata.md` with an `AFFILIATE-LINK-HERE` placeholder — never force a worse tool in to get one.

## Outputs — a new `videos/short-NNN/` project

Shorts projects are numbered `short-001`, `short-002`, … (`ls videos/` for the next number).

```
videos/short-NNN/
└─ script/
   ├─ short.md         the full doc: topic, format, hook, beats table (tool | claim | source URL),
   │                   per-beat visual intent (which lib/shorts.tsx piece + what goes in the proof slot)
   ├─ narration.txt    ONLY the spoken words, plain text — tools/gen_voiceover.py reads this verbatim
   └─ metadata.md      title (≤60 chars, number+outcome first), description (2 lines + affiliate
                       placeholders + disclosure line), 3 hashtags max, target publish slot
```

## QA gate before handing to /make-short

- [ ] Hook states the payoff in ≤ 12 words; would survive a 1.5s swipe test.
- [ ] Every tool claim has a source URL checked TODAY in `short.md`.
- [ ] narration.txt is 80–120 words, reads aloud clean (no URLs, no markdown, no "colon").
- [ ] Title/description/hashtags follow strategy §4; affiliate disclosure present if links planned.
- [ ] The topic isn't a repeat of the last 14 days (check `ls videos/short-*/script/short.md`).

Then: **`/make-short videos/short-NNN`** takes it from here (voice → visuals → render → draft upload).
