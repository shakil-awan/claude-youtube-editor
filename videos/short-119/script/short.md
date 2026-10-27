# short-119 — "Same Price, Half The Cache: Sonnet 5.5 And Sol 6.1"
- Format: versus (news-adjacent; slot 2026-10-28T15:00:00Z).
- Hooks: (A, chosen) "Same price. Half the cache bill."; (B) "Two labs halved cache hits to ten cents."; (C) "Your cache bill just got cut in half."

| Claim | Source (checked 2026-10-27) |
|---|---|
| Claude Sonnet 5.5: $2 in / $10 out, cache hits $0.10 per MTok | https://platform.claude.com/docs/en/about-claude/pricing |
| Claude Sonnet 5: $2 / $10, cache hits $0.20 | https://platform.claude.com/docs/en/about-claude/pricing |
| gpt-6.1-sol: $2.00 / $10.00, cached input $0.10 | https://developers.openai.com/api/docs/pricing |
| gpt-6-sol: $2.00 / $10.00, cached input $0.20 | https://developers.openai.com/api/docs/pricing |
Notes: Opus 5.5 cache hit $0.20 vs Opus 5 $0.50 (seed for a follow-up). Anthropic footnote: Sonnet 5.5 cache hits = 0.05x base input. List price, short prompts.
Visuals: proof slot = 2x2 table: model / input-output / cached input, old vs new.
