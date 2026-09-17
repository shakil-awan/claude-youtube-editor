# short-014 — "Stop Paying $10 Per Million Tokens. This AI Is Free."

- **Format:** replacement (strategy §2 #3 — "Stop paying for X — this free tool does it")
- **Angle:** named product (Atria Dawn Preview) + a hard number (744B params / $10 vs $0), the
  pattern the data favours
- **Slot:** buffer slot, 2026-09-18T21:00:00Z — evergreen: the model's weights and MIT license are
  already shipped and don't expire or get repriced the way a beta feature could
- **Research doc:** `videos/research/2026-09-17.md` (candidate #1, scored 22/25)

## Hook (3 variants, ≤12 words each)

1. **[WINNER]** "Stop Paying $10 Per Million Tokens. This AI Is Free." (10 words)
2. "This Free 744-Billion-Parameter AI Model Just Landed Open Source." (9 words)
3. "A Free AI Model Just Matched $10-Per-Million APIs." (8 words)

Winner picked because it leads with the money outcome (the price gap) before the product name,
matching the strategy §2 hook rule and learnings.md's proven "number + free + money outcome"
pattern more directly than variants 2–3, which lead with the spec instead.

## Beats + sources (every claim checked live, 2026-09-17)

| # | Claim | Source |
|---|---|---|
| 1 | Atria Dawn Preview: a 744B-parameter mixture-of-experts agentic model, built on a GLM-5.2 base, from Shanghai Artificial Intelligence Laboratory (InternLM org) | huggingface.co/internlm/Atria-Dawn-Preview — fetched today |
| 2 | Released under the MIT license — free to download, modify, and use commercially, no royalties; both BF16 and FP8 checkpoints published, plus hosted API access | huggingface.co/internlm/Atria-Dawn-Preview — fetched today |
| 3 | 256K context window | huggingface.co/internlm/Atria-Dawn-Preview — fetched today |
| 4 | Weights published to GitHub/Hugging Face 2026-09-11, FP8 checkpoint 2026-09-12, wide press coverage from 2026-09-15 | github.com/atria-asi/Atria-Dawn-Preview; startupfortune.com "Shanghai AI Lab Quietly Releases Atria" — fetched today |
| 5 | Atria's own reported BrowseComp score: 92.5. **Explicit caveat from the source itself: "none of those numbers are independently verified. No neutral lab has reproduced them yet."** | startupfortune.com — fetched today, caveat quoted directly |
| 6 | Claude Fable 5.1: $10 / $50 per 1M input/output tokens | claude.com/pricing — fetched today, vendor's own page |
| 7 | GPT-6 Astra: $10 / $50 per 1M input/output tokens (standard processing, short context) | developers.openai.com/api/docs/pricing — fetched today, vendor's own page |

**Explicitly cut:** an earlier aggregated search summary claimed a specific three-way BrowseComp
comparison (Atria 92.5 vs GPT-5.6 Sol 92.2 vs Claude Opus 5 90.8). I fetched Pandaily,
startupfortune.com, and ai-tldr.dev directly looking for that exact comparison and **none of them
contained it** — so it does not appear in the narration or the beats table above. Only claim #5,
which I could pin to an actual article with its own honesty caveat attached, made it in.

## Visual intent (remotion/src/lib/shorts.tsx)

- **Cover (0s, loop target):** `HookTitle` over `ShortBg` — "$10" crossed out next to "$0" in the
  accent color, hook text on screen at frame 0.
- **Beat 1 (setup):** `ToolCard` for Atria Dawn Preview — name, "744B parameters," "MIT license,"
  "Shanghai AI Lab."
- **Beat 2 (reveal):** `ToolCard` listing what MIT actually unlocks — download it, run it, sell
  products built on it, zero royalties.
- **Beat 3 (money, the proof slot):** three-column `ToolCard` price row — Claude Fable 5.1 "$10 /
  $50" · GPT-6 Astra "$10 / $50" · Atria Dawn Preview "$0."
- **Beat 4 (honesty beat):** a small on-screen caption, e.g. "self-reported score — not
  independently verified," timed under the BrowseComp 92.5 mention — keeps the claim honest on
  screen, not just in narration, per strategy §5's originality/trust policy.
- **Close:** return to the cover's price-comparison layout so last frame == first frame for the
  Shorts replay loop.

## CTA / loop

Ends on "Ten dollars versus zero. You do the math." — restates the hook's core contrast so the
replay reads as a clean loop. No dated "like and subscribe" line.
