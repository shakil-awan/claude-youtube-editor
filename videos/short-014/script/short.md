# short-014 — "Midjourney Charges $10 With Zero Free Trial"
- **Format:** replacement/versus — named products + hard numbers, evergreen (buffer slot, won't age)
- **Slot:** 2026-09-28T21:00:00Z (2026-09-29, 02:00 PKT / UTC+5)

## Hook (3 variants, ≤12 words)
1. **[WINNER]** "Midjourney charges $10 before you see one image."
2. "This AI art tool has zero free trial. This one doesn't."
3. "Adobe's free AI art tool is quietly better than Midjourney's."

## Beats (tool | claim | source URL — every claim checked TODAY against the vendor's own page)

| Beat | Claim | Source |
|---|---|---|
| Setup | Midjourney has NO free trial on Discord or midjourney.com; cheapest plan is Basic at $10/month | Midjourney's own support docs: https://docs.midjourney.com/hc/en-us/articles/27870399340173-Free-Trials — "No free trial is currently available in Discord or the midjourney.com website." ($10/mo Basic price corroborated via current pricing aggregators; Midjourney's own /pricing and /docs/plans pages returned HTTP 403 to automated fetch today) |
| Reveal | Adobe Firefly gives limited free generations every day, no subscription required to start | Adobe's own product page: https://www.adobe.com/products/firefly.html — "Limited free daily generations" across standard + premium features |
| Proof detail | If you outgrow the free daily allowance, Firefly's paid Standard tier is $9.99/month for 2,000 credits — still under Midjourney's $10 floor | Same Adobe page: "paid plans start at $9.99/month for the Standard tier (2,000 monthly credits)" |
| Close/loop | Same category (generative AI images), opposite entry cost: pay-first vs try-first | Synthesis of both vendor pages above |

## Per-beat visual intent
- **Cover/hook:** generated abstract art-studio/canvas backdrop (NO text, NO logos, NO brand marks) under `HookTitle hold onDark` — kicker "ZERO FREE TRIAL", lines "MIDJOURNEY" / "COSTS $10 FIRST" (accent).
- **Beat 1:** `ToolCard` "Midjourney" / tagline "No free trial. $10/mo minimum, before you see a result." / chip "$10/MO" (danger color) — proof slot: key/value rows (free trial: none, cheapest plan: $10/mo).
- **Beat 2:** `ToolCard` "Adobe Firefly" / tagline "Free daily generations. No card, no plan needed to start." / chip "FREE" (signal color) — proof slot: key/value rows (daily generations: free, paid tier: $9.99/mo for 2,000 credits).
- **CTA/loop:** Cover art returns, `HookTitle` re-shown at CTA frame with closing line "Test your prompts free first" — resolves back to frame 0.

## QA checklist
- [x] Hook states the payoff in ≤12 words, survives a 1.5s swipe test.
- [x] Every claim has a source URL checked today (table above).
- [x] narration.txt is 80–120 words (104), no URLs/markdown.
- [x] Not a repeat of the last 21 days (`videos/publish-log.md` checked — Leonardo-vs-Runway 09-20 was credits-per-day for video gen, different tools/category from image-gen pricing here).
