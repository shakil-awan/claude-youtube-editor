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

1. **Research the day — once, comprehensively, written down.** The output is a dated research doc
   `videos/research/YYYY-MM-DD.md` (committed — research is part of the reproducible pipeline),
   and 2–3 Shorts are scripted FROM it. Sweep four angles; each contributes candidates:
   - **Launch surfaces (news-jacks — best when found):** AI releases in the last 24–48h — the
     official blogs/changelogs of OpenAI, Google/DeepMind, Anthropic, Meta AI; Product Hunt's AI
     leaderboard; "released today AI tool" searches. A real launch beats any evergreen topic.
   - **Community heat:** what builders are actually excited about — Hacker News front page,
     r/artificial + r/ChatGPT hot posts, X/AI newsletters. Heat without a launch = evergreen
     angle with proven interest.
   - **Competitor breakouts:** what over-performed in the niche in the last 7 days (vidIQ MCP
     outliers when connected, else YouTube search sorted by views, filtered to this week,
     restricted to Shorts). We are not copying videos — we are reading which SUB-TOPICS the
     audience is bingeing right now.
   - **Coverage gaps:** formats/topics the strategy §2 mix says we owe (e.g. no versus in 2
     weeks) and anything `learnings.md` says to double down on.
2. **Score every candidate** in the research doc's table, 1–5 each — pick the top 2–3:
   - **Freshness** (launched today = 5, evergreen = 2)
   - **Money angle** (concrete $/time saved = 5, "cool" = 1)
   - **Provability** (we can show real numbers/UI in the proof slot = 5, hand-waving = 1)
   - **Saturation** (nobody covered it yet = 5, everywhere this week = 1)
   - **Learnings fit** (matches a proven hook/topic pattern = 5, contradicts one = 1)
   A candidate scoring under 15/25 doesn't get made. Record WHY the winners won — /shorts-report
   later checks whether the rubric's predictions held.
3. **Dedup against the last 14 days** — `ls videos/research/` + recent `short-*/script/short.md`
   topics. A repeat sub-topic is allowed only as an explicit follow-up to an outlier (§7).
4. **Fact-check gate (hard).** Every claim about a tool — pricing, free tier, feature, platform —
   verified against the tool's OWN site/docs today. One fabricated feature kills channel trust
   (strategy §5). Record the source URL per claim in `short.md`.
5. **Write the script.** Structure:
   - **Hook — write 3 variants (≤ 12 words each):** number + "free" (when true) + money outcome.
     Pick the one `learnings.md`'s hook patterns favor; keep the other two in `short.md` (they
     seed follow-ups and A/B ideas). The winner is stated in the first spoken line AND designed
     to appear on screen at 0s. Design the CTA so the loop back to the hook feels seamless —
     Shorts replay, and a clean loop reads as a second watch.
   - **Beats:** one tool ≈ 2 sentences — *name → what it does for your wallet → the specific
     number/use-case.* 3–5 beats for a listicle. For news-jacks/replacements, prefer the
     retention beat grammar (per hassancs91's shorts engine): **HOOK → SETUP → QUIZ (make them
     predict) → REVEAL → TWIST** — a mid-video open question measurably holds swipers.
   - **Ending — write for the LOOP:** Shorts replay automatically, and a seamless loop reads as
     a rewatch to the algorithm. Script the last line so it lands back on the hook's frame
     (e.g. close with the hook's claim restated). CTA is one short line at most, never a
     dated "like and subscribe" outro — and test CTA-free loops vs CTA via learnings.md.
   - **Length:** 80–120 words ≈ 30–45s at ~2.6 words/s. Never past 150 words (60s wall).
   - Write for the EAR: short sentences, no parentheticals, numbers as words ("thirty", not "30")
     when the TTS should speak them naturally.
6. **Affiliate pass** (strategy §3): if a covered tool has an affiliate program, note it in
   `metadata.md` with an `AFFILIATE-LINK-HERE` placeholder — never force a worse tool in to get one.
7. **Pinned comment** (in `metadata.md`): one open question that invites replies ("Which of these
   do you actually use?") plus the affiliate/disclosure line. Comments are an algorithm signal we
   can legitimately engineer; a question outperforms a link-dump.

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
