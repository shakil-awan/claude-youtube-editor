# short-105 — "Liquid's AI Costs 4 Cents Per Million. Output Free."
- Format: news-jack. Slot 2026-10-18T15:00:00Z.
- Hooks: (A, chosen) "Liquid's AI Costs 4 Cents Per Million. Output Free."; (B) "15,000 Images Classified For One Dollar"; (C) "This AI Charges Nothing For Its Answers"

| Claim | Source (checked 2026-10-17) |
|---|---|
| d1-ultra launched Oct 15; $0.042 per 1M input tokens; billed on input only | https://www.liquid.ai/blog/d1-ultra ; https://www.liquid.ai/pricing (output $0.00) |
| Takes text/images, returns probabilities for yes/no questions in one pass, no tokens generated | https://www.liquid.ai/blog/d1-ultra |
| 1024x1024 image ~1,536 tokens; each question billed as a separate prompt | same |
| Liquid claims it beats all other decision models on the Artificial Analysis Decision Index by 8+ points | same (vendor claim) |
Math: 1,536 x $0.042/1M = $0.0000645 per image-question; ~15,500 per dollar.
Visuals: proof slot = price rows and a billing math panel.
