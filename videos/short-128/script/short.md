# short-128 — "Fable 5.1 Cache Reads Cost 4x Less Than Fable 5"
- Format: versus/news-jack (slot 2026-11-10T22:00:00Z).
- Hooks: (A, chosen) "Claude's cache reads just got four times cheaper."; (B) "Fable 5.1: cache reads at a quarter."; (C) "Ten cache reads: ten dollars, or two fifty."

| Claim | Source (checked 2026-11-09) |
|---|---|
| Fable 5.1 base input $10 / MTok, output $50 | https://platform.claude.com/docs/en/about-claude/pricing |
| Fable 5.1 cache hits $0.25 / MTok (0.025x base input) | same, footnote 1 |
| Fable 5 cache hits $1 / MTok, same $10 input | same |
| Math: 10 reads x 1M tokens = $2.50 on 5.1 vs $10 on Fable 5 (reads only; 5m write $12.50 extra) | derived |
Visuals: cover poster -> price rows -> math -> closing cover.
