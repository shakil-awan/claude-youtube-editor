# short-149 — "OpenAI's Embeddings Cost 2¢. Google's Cost 20¢."
- Format: versus/evergreen (slot 2026-11-17T16:00:00Z).
- Hooks: (A, chosen) "OpenAI's cheapest embeddings cost two cents. Google's newest cost twenty."; (B) "Google's embeddings cost ten times OpenAI's. Here's why people pay it."; (C) "Two cents vs twenty cents: the embedding gap nobody shows."

| Claim | Source (checked 2026-11-16) |
|---|---|
| text-embedding-3-small $0.02 per 1M tokens; text-embedding-3-large $0.13 | https://developers.openai.com/api/docs/pricing |
| Gemini Embedding 2 text $0.20 per 1M (paid), free tier "Free of charge"; Batch text $0.10 | https://aistudio.google.com/docs/pricing |
| Gemini Embedding 2 image $0.00012 per image, audio $0.00016/s, video $0.00079/frame | same |
| OpenAI embedding models are text models (pricing page lists text input only) | https://developers.openai.com/api/docs/pricing |
Visuals: cover poster -> OpenAI card (small $0.02 / large $0.13) -> Gemini card ($0.20 text, 10x chip) -> quiz "why pay 10x?" -> free tier + batch card -> multimodal card (image/audio/video rates) -> closing cover.
