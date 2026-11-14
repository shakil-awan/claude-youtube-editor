# short-146 — "Claude Haiku And GPT-6 Luna Cost 10¢. Until 100K Tokens."
- Format: versus/evergreen (slot 2026-11-15T22:00:00Z).
- Hooks: (A, chosen) "Claude Haiku five point five and GPT six Luna both cost ten cents."; (B) "Past a hundred thousand tokens, Claude's cheap model costs five times more."; (C) "Same ten cents. Same one cent cache. Different cliff."

| Claim | Source (checked 2026-11-14) |
|---|---|
| Claude Haiku 5.5 (prompts up to 100K): $0.10 in, $0.01 cache hits, $0.50 out per MTok | https://platform.claude.com/docs/en/about-claude/pricing |
| Haiku 5.5 prompts over 100K: $0.50 in, $0.05 cache hits, $2.50 out; whole request priced at the higher rate | same (Long context pricing section) |
| GPT-6 Luna Standard short context (<=272K): $0.10 in, $0.01 cached, $0.50 out | https://developers.openai.com/api/docs/pricing |
| GPT-6 Luna long context (>272K): $0.20 in, $0.02 cached, $0.75 out | same |
| Math: 100K-272K: Haiku $0.50/$2.50 vs Luna $0.10/$0.50 = 5x | derived |
Visuals: cover poster -> tie card (both $0.10/$0.50, cache $0.01) -> Haiku >100K card -> Luna 272K card (quiz) -> reveal card ($0.20/$0.75 vs $0.50/$2.50) -> closing cover.
