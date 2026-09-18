# short-050 — "Suno Gives 50 Free Credits A Day. Udio Caps You At 3."

- **Format:** versus (fills a coverage gap — versus is under-produced vs the listicle-heavy recent
  batch; see `videos/research/2026-09-18.md`)
- **Slot:** 2026-09-19T15:00:00Z (buffer slot — evergreen format per the runbook, not a news-jack)
- **Score:** 19/25 (Freshness 2, Money 4, Provability 5, Saturation 4, Learnings-fit 4)
- **Researched/fact-checked:** 2026-09-18, against each vendor's own site

## Hook (3 variants, ≤12 words each)

1. **[WINNER]** "Suno Gives 50 Free Credits A Day. Udio Caps You At 3." — two named products,
   two hard numbers, matches learnings.md's "named product + hard number" pattern.
2. "One Free AI Music Tool Caps You At Three Songs A Day." (single-sided, weaker — doesn't name
   both products up front)
3. "Suno Vs Udio: Whose Free Plan Actually Makes You More Music?" (question hook — keep as an
   A/B seed for a follow-up)

## Beats + sources (fetched today, vendor's own pages)

| # | Claim | Source |
|---|---|---|
| 1 | Suno free plan: "50 credits per day", "No commercial rights", no downloads | `https://suno.com/pricing` (fetched 2026-09-18) |
| 2 | Suno Pro: $8/month, 2,500 credits/month, 20 song downloads/month, commercial use rights | `https://suno.com/pricing` (fetched 2026-09-18) |
| 3 | Suno Premier: $24/month, 10,000 credits/month, 60 downloads/month, commercial rights | `https://suno.com/pricing` (fetched 2026-09-18) |
| 4 | Udio free tier: "10 daily credits" plus "an additional monthly limit of 100 credits"; capped at "three 130-second songs per day" | `https://help.udio.com/en/articles/10739134-credits-and-credit-limits` (fetched 2026-09-18) |
| 5 | Udio Standard: $10/month, "up to 2400 credits per month" | same article, `https://help.udio.com/en/articles/10739134-credits-and-credit-limits` |
| 6 | Udio Pro: $30/month, "up to 6000 credits per month" | same article |

**Dropped claim (fact-check gate):** secondary sources (not Udio's own site) disagree on whether
Udio's Standard tier includes commercial rights or only Pro does, and Udio is mid-transition on a
UMG/Warner licensing settlement that has reportedly disabled some downloads — none of that is
confirmed in Udio's own first-party pages fetched today, so **no claim about Udio commercial
rights or download restrictions is made in this script.** The comparison stays strictly on credits
and price, which are both directly vendor-quoted.

## Structure

HOOK (both numbers, both products) → SETUP (what a credit buys on each platform) → QUIZ ("which
one is cheaper once you want to keep what you make?") → REVEAL (Suno $8 vs Udio $10 entry tier) →
TWIST (the gap holds at the top tier too — Suno $24 vs Udio $30) → LOOP CLOSE (restates the hook's
two numbers).

## Visual intent

- **Cover / proof slot:** a split-screen ToolCard-style comparison — Suno's logo + "50/day" on one
  side, Udio's logo + "3 songs/day" on the other. Held static frames 0–24 for the shelf tile.
- **Beat 1 (SETUP):** two stat tiles (credits/day) side by side, per-vendor color accents.
- **Beat 2 (QUIZ):** a plain question card, no answer yet — a beat of held silence/pause per the
  retention grammar.
- **Beat 3 (REVEAL):** price table reveal, Suno $8 row highlighted first, Udio $10 row second.
- **Beat 4 (TWIST):** the same table extends to the top tier ($24 vs $30), same layout so the
  pattern reads instantly.
- **Close:** returns to the cover split-screen layout for a seamless loop back to the hook frame.

## Affiliate pass (strategy §3)

Both Suno and Udio have historically run referral/affiliate programs; verify current terms before
adding a link. `metadata.md` carries an `AFFILIATE-LINK-HERE` placeholder for whichever program is
live at packaging time — do not force one in if neither program is currently active.
