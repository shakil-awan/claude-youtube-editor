# short-016 — "Synthesia's Free Plan Gives You 10 Minutes. HeyGen Gives You 3."
- **Format:** replacement/versus hybrid (named products + hard numbers in hook, per learnings.md)
- **Publish slot:** 2026-09-21T21:00:00Z (buffer — evergreen, won't age)

## Hook variants (≤12 words)
1. **[WINNER]** "This free AI avatar tool gives you 3x more video." — number + free + money outcome.
2. "Synthesia's free plan beats HeyGen's by 7 minutes a month."
3. "Stop paying for AI avatars — compare these free plans first."

## Beats (listicle-style compare, 2 tools ≈ 2 sentences each)
- **HOOK:** winning line, on screen at 0s.
- **Tool 1 — HeyGen free:** three videos a month, one minute each, so three minutes total. One
  custom avatar plus five hundred plus stock avatars, thirty plus languages.
- **Tool 2 — Synthesia free:** twelve hundred credits a month, about ten minutes of video. Nine
  avatars, one hundred sixty plus languages — but no downloads and the Synthesia watermark stays.
- **VERDICT:** for raw minutes, Synthesia's free tier wins more than three to one. For custom-avatar
  flexibility, HeyGen's free tier wins.
- **LOOP CLOSE:** restate hook — pick the free plan that matches what you're actually making.

## Claims (tool | claim | source URL)
| Claim | Source |
|---|---|
| HeyGen free: 3 videos/month, up to 1 min each | https://www.heygen.com/pricing |
| HeyGen free: 1 custom avatar, 500+ stock avatars, 30+ languages | https://www.heygen.com/pricing |
| Synthesia free: 1,200 credits/month ≈ 10 min of video | https://www.synthesia.io/pricing |
| Synthesia free: 9 avatars, 160+ languages, no downloads, watermark not removable | https://www.synthesia.io/pricing |

## Visual intent (per beat, remotion/src/lib/shorts.tsx)
- Cover: two-tool comparison motif, dark charcoal + emerald/gold, single bold subject, no text baked in.
- Beats: ToolCard per product with a real spec-row proof slot (minutes/month, avatars, languages)
  side by side — not text alone.
- Verdict beat: a simple comparison bar (3 min vs 10 min) as the proof.
- Close: return to cover layout for the loop.

## QA checklist
- [x] Hook ≤12 words, states payoff, survives 1.5s swipe test.
- [x] Every claim sourced + checked today (2026-09-20) against each vendor's own pricing page.
- [x] Not a repeat of last 14 days (first avatar/video-tool versus in the ledger).
- [x] 80–120 words target for narration.
- [x] Affiliate check: HeyGen and Synthesia both run affiliate programs — noted in metadata.md
      with placeholders; neither tool was favored to force a link, both are named on their merits.
