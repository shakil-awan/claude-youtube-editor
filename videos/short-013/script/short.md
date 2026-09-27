# short-013 — "Google Just Made Its AI Video Tool Free"
- **Format:** news-jack — named product + hard number in the hook (learnings.md: news-jacks ~4x listicles)
- **Slot:** 2026-09-28T15:00:00Z (2026-09-28, 20:00 PKT / UTC+5)

## Hook (3 variants, ≤12 words, winner picked for learnings' "number + free + money outcome")
1. **[WINNER]** "Google just made its paid AI video tool free" — states payoff, on-screen at 0s.
2. "This AI video generator used to cost $19.99 a month."
3. "Google silently dropped the paywall on AI video."

## Beats (tool | claim | source URL — every claim checked TODAY against the vendor's own page)

| Beat | Claim | Source |
|---|---|---|
| Setup | Google Vids' Gemini Omni video generation launched May 2026 gated behind paid Google AI plans (Plus/Pro/Ultra) | Android Authority, "Google Vids' Omni video generator is now free to try" (accessed 2026-09-27); corroborated by Decrypt, "Google Just Made Free 1080p AI Video Generation Available to Anyone" |
| Reveal | As of Sept 23 2026, ANY Google or Workspace account gets full 1080p video generation with Gemini Omni 1.1 Flash, free | Google's own blog: https://blog.google/products-and-platforms/products/workspace/gemini-omni-in-google-vids/ — "Anyone with a Google or Google Workspace account can generate high-quality videos at no cost" |
| Proof detail | Scene extension keeps lighting/characters/environment consistent across the extended shot | Same Google blog post |
| The catch/twist | Every clip carries an invisible SynthID watermark; paid plans still unlock more generations + Workspace admin controls | Same Google blog post ("imperceptible SynthID digital watermark embedded into the video frames") |
| Price contrast (used in visual, not spoken) | Google AI Pro, the plan that used to gate this, is $19.99/month | https://gemini.google/subscriptions/ (corroborated: aipricing.guru/subscriptions/google-ai-pro/, otontechnology.com) |

## Per-beat visual intent
- **Cover/hook:** generated dramatic backdrop (camera/film-reel abstract motif, NO text, NO logos) under `HookTitle hold onDark` — kicker "USED TO COST $19.99/MO", lines "AI VIDEO" / "IS NOW FREE" (accent).
- **Beat 1 (setup → reveal):** `ToolCard` "Google Vids" / tagline "Free 1080p video with Gemini Omni 1.1" / chip "FREE" — proof slot: a simple browser-frame clone of vids.new's "Create AI videos" tile (via lib/browser.tsx, no real screen recording).
- **Beat 2 (the catch):** `ToolCard` "The catch" / tagline "Every clip is watermarked. Paid plans still unlock more." / chip "READ THIS" (danger color) — proof slot: key/value rows (watermark: SynthID, price to gate before: $19.99/mo).
- **CTA/loop:** Cover art returns, `HookTitle` re-shown at CTA frame (same as short-012's pattern) with a short line "Try it at vids.new" — resolves back to frame 0 for the seamless loop.

## QA checklist
- [x] Hook states the payoff in ≤12 words, survives a 1.5s swipe test.
- [x] Every claim has a source URL checked today (table above).
- [x] narration.txt is 80–120 words (117), no URLs/markdown.
- [x] Not a repeat of the last 21 days (`videos/publish-log.md` checked — no Google Vids / video-gen coverage).
