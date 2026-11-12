# short-141 — "Google's New AI Writes Zero Words. Costs 10¢."
- Format: news-jack (slot 2026-11-13T16:00:00Z). Launched Nov 11, 2026.
- Hooks: (A, chosen) "Google's new AI never writes a word. Ten cents per million."; (B) "Output tokens: zero. Google's Decision API only bills input."; (C) "Ask one thousand questions. Pay for your data once."

| Claim | Source (checked 2026-11-12) |
|---|---|
| Gemini Decision (gemini-decision-1) + Decisions API released Nov 11, 2026 | https://aistudio.google.com/docs/changelog |
| Paid input $0.10 per 1M tokens (text/image/video/audio/PDF); output n/a — zero output tokens; free tier input free | https://aistudio.google.com/docs/pricing |
| Output token usage is always 0; only input tokens billed; shared input counted once per request regardless of question count | https://aistudio.google.com/docs/decisions-api |
| 1 to 1,000 questions per request; yes/no, choice, score (rubric); returns calibrated probabilities + confidence | https://aistudio.google.com/docs/decisions-api |
| 262,144-token context; no caching, no Batch API | https://aistudio.google.com/docs/models/gemini-decision-1 , decisions-api |
| Gemini 3.8 Flash $0.75 in / $3.75 out (through Dec 31) | https://aistudio.google.com/docs/pricing |
Visuals: cover poster -> ToolCard Decision price rows (input $0.10 / output $0 / questions 1,000) -> ToolCard three question types -> ToolCard vs 3.8 Flash -> closing cover.
