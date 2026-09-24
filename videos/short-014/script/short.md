# short-014 — "Claude's New Flagship Just Got 40% Cheaper"

- **Topic:** Anthropic launched Claude Opus 5.5 this week — list price down 20%, cache reads down
  60%, and roughly 40% cheaper overall on a typical token-billed workload than Opus 5. It shipped
  about 90 minutes before OpenAI's GPT-6 Sol/Luna cut (short-013) the same day.
- **Format:** news-jack (learnings.md: news-jacks with a named product + hard number outperform
  listicles ~4x — different company/product than short-013, per the slot brief)
- **Publish slot:** 2026-09-24T21:00:00Z
- **Target length:** ~117 words ≈ 45s at 2.6 words/s
- **Researched/fact-checked:** 2026-09-24 (see `videos/research/2026-09-24.md`)

## Hook (3 variants — winner marked)

1. **WINNER →** "Anthropic's Claude Opus five point five just got forty percent cheaper."
   (11 words — named product + hard number + money outcome)
2. "Claude just launched its cheapest flagship model ever." (8 words)
3. "Anthropic cut Opus five point five's price by forty percent." (10 words)

## Beats (HOOK → SETUP → QUIZ → REVEAL → TWIST — news-jack grammar)

| Beat | Tool | Claim spoken | Source URL (fetched 2026-09-24) |
|---|---|---|---|
| HOOK | Claude Opus 5.5 | Costs ~40% less than Opus 5 on a typical token-billed workload | https://www.anthropic.com/claude/opus |
| SETUP | Claude Opus 5.5 | Launched this week for coding and long agent tasks, the highest-token-burn jobs | https://www.anthropic.com/claude/opus |
| QUIZ | Claude Opus 5.5 | Open question: what do cached tokens cost now? | — (rhetorical, sets up REVEAL) |
| REVEAL | Claude Opus 5.5 | List price $4 in / $20 out per million tokens (20% below Opus 5); cache reads $0.20 per million (60% cheaper) | https://www.anthropic.com/claude/opus |
| TWIST | GPT-6 Sol / Luna | OpenAI answered back ~90 minutes later the same day with two cheaper GPT-6 tiers of its own | https://developers.openai.com/api/docs/pricing (Sol $2/$10, Luna $0.10/$0.50); corroborated by VentureBeat & SiliconANGLE same-day coverage |

## Ending (loop) + CTA

Ending restates "forty percent cheaper" to land back on the hook's claim for a seamless replay.
CTA is one line, undated, not a "like and subscribe" outro.

## Visual intent (remotion/src/lib/shorts.tsx)

- **Cover / frame 0 (held):** `CoverImage` — "OPUS 5.5 / 40% CHEAPER" over `ShortBg` with the
  brand accent glow (this is the packaging — Shorts have no custom thumbnail off-YPP).
- **HOOK (0–3s):** `HookTitle` synced to the spoken hook line, `ProgressBar` starts,
  `CaptionTrack` begins word-synced captions.
- **SETUP (~3–11s):** `ToolCard` for "Claude Opus 5.5" — tagline "For coding & long agent runs",
  chip `$4 / $20`. Proof slot: a cropped `WebBrowserFrame` (remotion/src/lib/browser.tsx) clone of
  Anthropic's Opus pricing block — fake-screencast technique, no real recording.
- **QUIZ (~11–15s):** Reuse `HookTitle` mid-video as a centered question card: "What do cached
  tokens cost now?" — held, unanswered, for the QUIZ beat.
- **REVEAL (~15–22s):** Same `ToolCard` updates its chip to `$0.20 / cache` with a `%` stat overlay
  ("60% OFF cache") animated via the card's chip-pop motion — the CountBadge pill style repurposed
  as the stat badge.
- **TWIST (~22–28s):** Quick secondary `ToolCard` cameo for "GPT-6 Sol / Luna" — tagline "OpenAI
  answered 90 minutes later", chip `from $0.10`, shorter `at` duration so it reads as an aside,
  not a fourth full beat (mirrors short-013's Opus 5.5 cameo, for cross-video continuity).
- **LOOP / ending (~28–34s):** Cut back to the `CoverImage` composition with "40% CHEAPER" restated
  in `HookTitle` for the seamless replay read.
- **Throughout:** `CaptionTrack` word-synced captions, `ProgressBar`, `Watermark` in the final frames.

## Affiliate pass

No public affiliate/referral program found for Anthropic's API or Claude subscriptions. Per
NICHE-STRATEGY.md §3, no worse tool is substituted to force one — this video carries no affiliate
link.
