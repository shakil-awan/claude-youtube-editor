# short-015 — Notion's AI paywall

**Format:** news-jack (a pricing-model shift, confirmed on the vendor's own pages today)
**Slot:** 2026-09-26T15:00:00Z (earliest of the two — freshest story)
**Research:** see `videos/research/2026-09-25.md` candidate #1 (21/25)

## Hook (winner in bold, 2 alternates kept for future A/B)

- **"Notion Just Put Its AI Behind The $20 Plan"** ← winner: named product + hard number, matches
  the "$20 plan" pattern learnings.md flags as our best-performing hook shape so far.
- "Free Notion Users Just Lost Their AI" (weaker: no number)
- "Notion's AI Isn't Free Anymore" (weaker: no number, no plan price)

## Beats (claim → source, checked today)

| Beat | Claim | Source (fetched today) |
|---|---|---|
| 1 | Notion's Business plan costs **$20 per member/month** and bundles full Notion AI (writing assistant, Notion Agent, AI Meeting Notes, Enterprise Search beta) at no extra per-seat charge. | notion.com/pricing |
| 2 | Free and Plus plans get only a **"Limited Trial"** of Notion AI — no ongoing access. | notion.com/pricing |
| 3 | Once a Free/Plus workspace uses up its complimentary AI responses, Notion shows an upgrade prompt: "an upgrade to the Business or Enterprise Plan is necessary to continue using AI features." | notion.com/help/complimentary-ai-responses |

No historical "$10 add-on" claim used — could not verify that figure on a Notion-owned page today,
so the script sticks to what's confirmed live: the current Business-only bundling and the
trial-then-wall behavior on Free/Plus.

## Structure (news-jack retention grammar: HOOK → SETUP → QUIZ → REVEAL → TWIST)

1. **HOOK** — Notion just put its AI behind the $20 plan.
2. **SETUP** — open Notion's own pricing page today: full Notion AI only ships with Business.
3. **QUIZ** — what do Free and Plus get instead?
4. **REVEAL** — a limited trial, a handful of complimentary replies, then an upgrade wall.
5. **TWIST** — if your team lives on the free plan, the AI you tried is already gone; $20/month is
   what Notion wants for the AI half of the product now.
6. **LOOP** — closing line restates the hook so the replay reads clean.

## Visual intent (per beat, for /make-short — `remotion/src/lib/shorts.tsx`)

- **Frame 0 / cover:** CoverImage (bold Notion-adjacent workspace art, no logos/text per gen_image
  rules) + HookTitle (hold, onDark) stating the hook line.
- **Beat 1 proof slot:** a price-table card — Free $0 / Plus $10 / **Business $20** (highlighted),
  "Notion AI included" checked only on Business.
- **Beat 2–3 proof slot:** a simple "Trial → Wall" spec row (complimentary responses → upgrade
  prompt), not text alone.
- **Close:** return to the cover layout so the loop is seamless; CTA line is the restated hook.

## Length check

Narration is 90 words ≈ 35s at 2.6 words/s — inside the 30–45s band, well under the 150-word/60s wall.
