# short-015 — "OpenAI's Cheapest Frontier Price Expires In 62 Days"
- **Format:** news-jack (learnings.md: named product + hard number in hook)
- **Publish slot:** 2026-09-21T15:00:00Z

## Hook variants (≤12 words)
1. **[WINNER]** "OpenAI's cheapest AI price ever expires in weeks." — states payoff + urgency, matches
   learnings.md's proven "named product + hard number" pattern.
2. "GPT-5.6 just got 33% cheaper — but there's a deadline."
3. "This AI price cut has an expiration date: November 21st."

## Beats (HOOK → SETUP → QUIZ → REVEAL → TWIST, per the retention grammar)
- **HOOK:** the winning line above, on screen at 0s over the cover.
- **SETUP:** OpenAI's flagship model, GPT-5.6 Sol, just dropped its API price.
- **QUIZ:** "Guess how much cheaper — ten percent? Twenty?"
- **REVEAL:** input tokens down twenty percent, five dollars to four dollars per million; output
  down a third, thirty dollars to twenty dollars per million. Applies to the API, Codex credits,
  and ChatGPT Work — not Plus, Pro, or Business.
- **TWIST:** it's not permanent. The price rolls back November twenty-first, twenty twenty-six.
- **LOOP CLOSE:** restate hook — lock in the cheap rate before the clock runs out.

## Claims (tool | claim | source URL)
| Claim | Source |
|---|---|
| GPT-5.6 Sol API price cut from $5/$30 to $4/$20 per million input/output tokens | https://community.openai.com/t/20-price-reduction-for-gpt-5-6-sol-api-codex-credits-and-chatgpt-work/1391726 |
| Cut is ~20% lower input, ~33% lower output | same |
| Promo runs through November 21, 2026 | same; cross-checked https://www.citybiz.co/article/892929/openai-cuts-gpt-5-6-sol-api-pricing-20-for-three-months/ |
| Applies to API, Codex credits, ChatGPT Work; Plus/Pro/Business unchanged | same community.openai.com thread |
| Original announcement dated August 21, 2026 | https://tokencost.app/blog/gpt-5-6-sol-price-cut |

## Visual intent (per beat, remotion/src/lib/shorts.tsx)
- Cover: bold "$4/$20" price tag motif, dark charcoal + emerald/gold, no text baked into art.
- SETUP/REVEAL: ToolCard for "GPT-5.6 Sol" with a before/after price table as the proof slot
  ($5→$4 in, $30→$20 out).
- TWIST: a countdown/calendar motif marking Nov 21, 2026.
- Close: return to cover layout for the loop.

## QA checklist
- [x] Hook ≤12 words, states payoff, survives 1.5s swipe test.
- [x] Every claim sourced + checked today (2026-09-20).
- [x] Not a repeat of last 14 days (GPT-6 Astra pricing on Sept 8 was a different model/price point).
- [x] 80–120 words target for narration.
