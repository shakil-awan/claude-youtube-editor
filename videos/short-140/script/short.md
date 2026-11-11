# short-140 — "OpenAI's Cyber AI Costs $100 Out. Astra: $50."
- Format: versus/evergreen (slot 2026-11-12T22:00:00Z).
- Hooks: (A, chosen) "OpenAI's security AI costs twice its flagship."; (B) "GPT six Cyber: one hundred dollars per million output tokens."; (C) "Past 272K tokens, Cyber output hits $150."

| Claim | Source (checked 2026-11-11) |
|---|---|
| gpt-6-cyber ≤272K: $20 in / $2 cached / $100 out per 1M | https://developers.openai.com/api/docs/pricing , https://developers.openai.com/api/docs/models/gpt-6-cyber |
| gpt-6-cyber >272K: $40 in / $4 cached / $150 out | same |
| Requires Daybreak Red access + approval; for vulnerability investigation/repro/fix verification | https://developers.openai.com/api/docs/models/gpt-6-cyber |
| gpt-6-astra $10 in / $1 cached / $50 out | https://developers.openai.com/api/docs/pricing |
| gpt-5.6-cyber $12.50 / $75 | https://developers.openai.com/api/docs/pricing |
| Math: 1M out = $100 vs $50 -> 2x | derived |
Visuals: cover poster -> ToolCard Cyber vs Astra rows -> ToolCard long-context row -> closing cover.
