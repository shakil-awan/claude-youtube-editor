# short-016 — "Stop Paying A Web Designer. This AI Builds It Free."

- **Topic:** Framer's free plan uses AI to generate a full website from a prompt — a genuine
  replacement for paying a freelance designer for a simple site, with one honest catch (custom
  domain needs a paid plan).
- **Format:** replacement (NICHE-STRATEGY.md §2 #3) — evergreen, different topic than short-015
  (design/web tooling vs. calendar tooling), closes the same format-mix gap
- **Publish slot:** 2026-09-25T21:00:00Z
- **Target length:** ~113 words ≈ 43s at 2.6 words/s
- **Researched/fact-checked:** 2026-09-24 (see `videos/research/2026-09-24.md`)

## Hook (3 variants — winner marked)

1. **WINNER →** "Stop paying a web designer. This AI builds it free." (10 words — matches the
   channel's proven "Stop paying for X" replacement pattern, NICHE-STRATEGY.md §2 example wording)
2. "Framer's free plan builds a full website with AI." (9 words)
3. "This free AI tool builds your website. No coding." (9 words)

## Beats

| # | Tool | Claim spoken | Source URL (fetched 2026-09-24) |
|---|---|---|---|
| 1 | Framer | AI generates a full site design from a text prompt; free plan, 500 AI credits/month, no card required | https://www.framer.com/pricing |
| 2 | Framer (wallet math) | A freelance web designer typically runs hundreds of dollars for a simple site; Framer's free plan costs $0 | https://www.framer.com/pricing |
| 3 | Framer (catch) | Free-plan sites are hosted on a Framer subdomain — a custom domain requires the $10/month Basic plan | https://www.framer.com/pricing |
| 4 | Framer (paid tier, for scale) | Pro is $30/month with 3,000 AI credits — still a fraction of hiring a designer for ongoing changes | https://www.framer.com/pricing |

## Ending (loop) + CTA

Ending restates the hook's claim ("this free AI still builds your website") to land back on the
opening frame for a seamless replay. CTA is one line, undated.

## Visual intent (remotion/src/lib/shorts.tsx + fake-screencast technique)

- **Cover / frame 0 (held):** `CoverImage` — "FREE AI WEBSITE BUILDER" over `ShortBg` (this is the
  packaging — Shorts have no custom thumbnail off-YPP).
- **HOOK (0–3s):** `HookTitle` synced to the spoken hook, `ProgressBar` starts, `CaptionTrack`
  begins word-synced captions.
- **Beat 1 (~3–12s):** `ToolCard` for "Framer" — tagline "Type a prompt, get a full site", chip
  `FREE`. Proof slot: this is the beat where a real **`/fake-screencast`** pays off — a simulated
  Framer editor with an animated cursor typing a prompt into the AI panel and the page assembling,
  built on `remotion/src/lib/screencast.tsx` (browser chrome from `remotion/src/lib/browser.tsx`'s
  `WebBrowserFrame`) — genuinely more convincing than a static screenshot for a "watch it build"
  beat.
- **Beat 2 (~12–19s):** Same `ToolCard`, tagline swapped to "A freelancer costs hundreds. This is
  $0" — chip stays `FREE`, no new proof slot needed (text-driven wallet-math beat).
- **Beat 3 / catch (~19–26s):** `ToolCard` tagline swaps to "Free = Framer subdomain", chip
  updates to `$10/mo for your domain` — signals the honest limitation before the upsell beat.
- **Beat 4 (~26–32s):** `ToolCard` chip updates once more to `$30/mo Pro`, tagline "3,000 credits —
  still cheaper than hiring".
- **LOOP / ending (~32–38s):** Cut back to the `CoverImage` composition with the hook restated in
  `HookTitle` for the seamless replay read.
- **Throughout:** `CaptionTrack` word-synced captions, `ProgressBar`, `Watermark` in the final frames.

## Affiliate pass

No public Framer affiliate/referral program was confirmed during this research pass (Framer does
run partner/creator programs at times — re-verify at packaging time). AFFILIATE-LINK-HERE
placeholder left in metadata.md in case one is confirmed before render; per NICHE-STRATEGY.md §3,
no worse tool is substituted to force a fit.
