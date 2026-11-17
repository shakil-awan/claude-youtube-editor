# short-152 — "Google's Voice AI: 2.3¢ A Minute. OpenAI's: 5¢."
- Format: versus/evergreen — slot 2026-11-18T22:00:00Z.
- Hooks: (A, chosen) "Google's voice AI costs two point three cents a minute. OpenAI's costs five."; (B) "Gemini Live is free. GPT-Live is 5 cents a minute."; (C) "Your voice agent costs half on Gemini 3.8 Live."
- Beat grammar: HOOK -> SETUP (OpenAI flat rate) -> Gemini split billing -> REVEAL (worst case 2.3c) -> TWIST (free tier, data use) -> loop.

| Claim | Source (checked 2026-11-17) |
|---|---|
| gpt-live-1: $0.05/minute, billed per second | https://developers.openai.com/api/docs/pricing |
| Gemini 3.8 Live paid: audio input $3.00 per 1M or $0.005/min; audio output $12.00 per 1M or $0.018/min | https://aistudio.google.com/docs/pricing |
| Gemini 3.8 Live free tier: input and output "Free of charge"; used to improve products: Yes (free) / No (paid) | same |
| 0.005 + 0.018 = $0.023/min upper bound when both directions stream a full minute; 2.3/5 = 46% | arithmetic |
Visuals: cover poster -> GPT-Live card ($0.05/min flat) -> Gemini Live card (in $0.005 / out $0.018) -> sum card (2.3c vs 5c, -54%) -> free-tier twist card (FREE, data use note) -> closing cover.
