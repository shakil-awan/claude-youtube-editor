# short-013 — "OpenAI's New AI Costs 10 Cents Per Million Tokens"

- **Topic:** OpenAI released two new GPT-6 tiers this week — Sol and Luna — at roughly half the
  price of the GPT-5.6-era models. Luna is the cheapest model OpenAI has ever shipped.
- **Format:** news-jack (learnings.md: news-jacks with a named product + hard number in the hook
  outperform listicles ~4x on this channel — bias toward this pattern)
- **Publish slot:** 2026-09-24T15:00:00Z
- **Target length:** ~103 words ≈ 40s at 2.6 words/s
- **Researched/fact-checked:** 2026-09-24 (see `videos/research/2026-09-24.md`)

## Hook (3 variants — winner marked)

1. **WINNER →** "OpenAI's GPT-6 Luna costs ten cents per million tokens." (9 words — named product
   + hard number + money outcome, per learnings.md's proven pattern)
2. "OpenAI just shipped its cheapest AI ever. Ten cents." (9 words)
3. "This new OpenAI model runs a million tokens for a dime." (11 words)

## Beats (HOOK → SETUP → QUIZ → REVEAL → TWIST — news-jack grammar)

| Beat | Tool | Claim spoken | Source URL (fetched 2026-09-24) |
|---|---|---|---|
| HOOK | GPT-6 Luna | Costs $0.10 input / $0.50 output per million tokens | https://developers.openai.com/api/docs/pricing |
| SETUP | GPT-6 Luna & Sol | OpenAI released both this week, built for high-volume, lower-intelligence tasks (summaries, tickets, short answers) | https://developers.openai.com/api/docs/pricing |
| QUIZ | GPT-6 Luna | Open question: how much cheaper is Luna than the prior generation? | — (rhetorical, sets up REVEAL) |
| REVEAL | GPT-6 Luna & Sol | Roughly 50% below GPT-5.6-era pricing; Sol (the mid tier) is $2 in / $10 out per million tokens | https://developers.openai.com/api/docs/pricing |
| TWIST | Claude Opus 5.5 | Anthropic cut Claude's flagship price ~90 minutes before OpenAI's release the same day — a live price war | https://www.anthropic.com/claude/opus (Opus 5.5: $4 in/$20 out, 20% below Opus 5); corroborated by VentureBeat & SiliconANGLE same-day coverage |

## Ending (loop) + CTA

Ending restates the hook's number ("ten cents") to land back on the opening frame for a seamless
replay. CTA is one line, undated, action-oriented (not "like and subscribe").

## Visual intent (remotion/src/lib/shorts.tsx)

- **Cover / frame 0 (held):** `CoverImage` — bold "10¢ / MILLION TOKENS" over `ShortBg` with the
  brand accent glow. This is the packaging (Shorts have no custom thumbnail off-YPP).
- **HOOK (0–3s):** `HookTitle` synced to the spoken hook line, `ShortBg` behind it, `ProgressBar`
  starts, `CaptionTrack` begins word-synced captions.
- **SETUP (~3–10s):** `ToolCard` for "GPT-6 Luna" — tagline "Built for huge volumes of simple
  tasks", chip `$0.10 / $0.50`. Proof slot: a cropped `WebBrowserFrame` (remotion/src/lib/browser.tsx)
  clone of the OpenAI pricing table row for Luna — the fake-screencast technique, no real screen
  recording needed.
- **QUIZ (~10–14s):** Reuse `HookTitle` mid-video as a big centered question card: "How much
  cheaper than last gen?" — no answer shown yet, holds the beat for the QUIZ grammar.
- **REVEAL (~14–20s):** A second `ToolCard` for "GPT-6 Sol" — tagline "The mid-tier, for real
  coding work", chip `$2 / $10`, with a large `%` stat overlay ("~50% OFF") animated in via the
  card's chip-pop motion. `CountBadge`-style pill repurposed as the "50%" stat badge.
- **TWIST (~20–27s):** Quick third `ToolCard` cameo for "Claude Opus 5.5" — tagline "Anthropic
  moved 90 minutes earlier", chip `$4 / $20`, smaller/secondary framing (shorter `at` duration) to
  read as an aside, not a fourth full beat.
- **LOOP / ending (~27–33s):** Cut back to the `CoverImage` frame (same composition as 0s) with the
  hook's "10¢" restated in `HookTitle` for the seamless replay read.
- **Throughout:** `CaptionTrack` word-synced captions, `ProgressBar`, `Watermark` in the final frames.

## Affiliate pass

No affiliate program exists for OpenAI's API (no consumer referral/commission program found).
Per NICHE-STRATEGY.md §3, no worse tool is substituted to force one — this video carries no
affiliate link.
