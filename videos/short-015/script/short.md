# short-015 — "This AI Calendar Is Free. This One Costs $19."

- **Topic:** Reclaim.ai (free Lite plan, forever) vs Motion (no free plan, $19/seat/mo Pro AI) —
  two AI scheduling/calendar assistants with opposite pricing models.
- **Format:** versus (NICHE-STRATEGY.md §2 #4) — evergreen, closes a format-mix gap (last clean
  `versus` on the channel was short-011, 2026-08-12)
- **Publish slot:** 2026-09-25T15:00:00Z
- **Target length:** ~115 words ≈ 44s at 2.6 words/s
- **Researched/fact-checked:** 2026-09-24 (see `videos/research/2026-09-24.md`)

## Hook (3 variants — winner marked)

1. **WINNER →** "Reclaim is free forever. Motion costs nineteen a month." (9 words — named
   products + hard number + money outcome)
2. "This AI calendar is free. This one costs nineteen dollars." (10 words)
3. "Skip the nineteen dollar AI calendar. This one is free." (10 words)

## Beats

| # | Tool | Claim spoken | Source URL (fetched 2026-09-24) |
|---|---|---|---|
| 1 | Reclaim.ai | Free "Lite" plan, forever — 5 AI agents auto-block Focus Time, Habits, and tasks, synced to 1 calendar | https://reclaim.ai/pricing |
| 2 | Motion | No free plan at all — Pro AI is $19/seat/month for AI calendar, meeting notes, task planning, and docs | https://www.usemotion.com/pricing |
| 3 | Reclaim.ai (catch) | Free tier caps at a 1-week scheduling window and 1 synced calendar — Starter ($10/mo) removes both limits | https://reclaim.ai/pricing |
| 4 | Verdict | Solo users who just want smart time-blocking: Reclaim saves the full $19/month. Teams needing docs + time tracking: Motion's fee earns its keep | https://reclaim.ai/pricing, https://www.usemotion.com/pricing |

## Ending (loop) + CTA

Ending restates both prices ("Reclaim is still free. Motion is still nineteen.") to land back on
the hook's frame for a seamless replay. CTA is one line, undated.

## Visual intent (remotion/src/lib/shorts.tsx)

- **Cover / frame 0 (held):** `CoverImage` — "FREE vs $19/mo" split-composition over `ShortBg`
  (this is the packaging — Shorts have no custom thumbnail off-YPP).
- **HOOK (0–3s):** `HookTitle` synced to the spoken hook, `ProgressBar` starts, `CaptionTrack`
  begins word-synced captions.
- **Beat 1 (~3–11s):** `CountBadge` "1 / 2" over a `ToolCard` for "Reclaim.ai" — tagline "Free,
  forever — smart time blocking", chip `FREE` (signal color). Proof slot: cropped `WebBrowserFrame`
  (remotion/src/lib/browser.tsx) clone of Reclaim's pricing page Lite column — fake-screencast
  technique, no real recording.
- **Beat 2 (~11–19s):** `CountBadge` "2 / 2" over a `ToolCard` for "Motion" — tagline "No free
  plan — AI docs & meeting notes", chip `$19/mo`. Proof slot: cropped `WebBrowserFrame` clone of
  Motion's Pro AI pricing card.
- **Beat 3 / catch (~19–25s):** Same Reclaim `ToolCard` re-enters with tagline swapped to "Free
  tier: 1 week ahead, 1 calendar" — signals the honest limitation before the verdict.
- **Beat 4 / verdict (~25–31s):** Both `ToolCard`s' chips (`FREE` / `$19/mo`) shown side by side
  (stacked, staggered `at` times) for the direct comparison read.
- **LOOP / ending (~31–37s):** Cut back to the `CoverImage` composition with both prices restated
  in `HookTitle` for the seamless replay read.
- **Throughout:** `CaptionTrack` word-synced captions, `ProgressBar`, `Watermark` in the final frames.

## Affiliate pass

Neither Reclaim.ai nor Motion has a publicly listed affiliate/referral program found during this
research pass. Per NICHE-STRATEGY.md §3, no worse tool is substituted to force one — this video
carries no affiliate link. (Flag for re-check at packaging time in case either program launches
before render.)
