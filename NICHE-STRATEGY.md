# NICHE-STRATEGY.md — the channel contract for Shorts

**The niche: AI tools for money & business — faceless YouTube Shorts.**
This file is the strategy contract the Shorts pipeline reads (`/write-short` reads it before every
script; `/shorts-report` grades performance against it). It is data-backed, not vibes — sources and
numbers below, pulled via vidIQ on **2026-08-07**. Re-validate quarterly or when growth stalls.

---

## 1. The decision (and the data behind it)

**Make Shorts about AI tools that make or save people money.** Not "AI news", not generic
"AI facts" — every video answers: *which tool, what does it do for your wallet/business, why now.*

Why this niche wins on the three axes that matter:

### Demand is large AND accelerating right now
- Keyword **"ai tools"**: volume **89/100**, ~**935K** monthly YouTube searches globally.
- Views-per-hour on the keyword **tripled in 30 days** (≈200K VPH early July → 600K+ VPH in
  August 2026). The wave is rising, not cresting.
- Best sub-angle by opportunity score: **"ai tools for business" — 72.5 overall with competition
  only 34.4** (vs 67 competition for generic "ai tools"). That is the lane: business/money framing.

### Small channels break out here — proven, last 90 days (vidIQ outliers, Shorts only)
| Channel | Subs | One Short's views | Breakout |
|---|---|---|---|
| NexusAi Technology | **11** | **715,418** | 15,222× channel average |
| Skylar | 24.8K | 698,391 | 17× |
| Gadgets Now | 5.6K | 310,744 | 147× |
| Nick Automates | 49.8K | 107,215 | 3.5× |
| Ai_with_agilen | 3.0K | 102,967 | 155× |
| P1XEL WORD | 1.1K | 40,025 | 15× |

An 11-subscriber channel pulled 715K views on one Short. **This niche does not require an
existing audience** — Shorts are shopped to cold viewers; the hook does the work.

### It is the only major niche where THIS repo is an unfair advantage
The fork's fake-screencast engine (`remotion/src/lib/screencast.tsx`, browser + VS Code shells)
generates tool UIs as code. Competitors screen-record every tool they cover — we render the
walkthrough in minutes, on brand, without installing anything. Every other faceless niche
(finance, psychology, horror) throws that advantage away.

## 2. What we make — 4 repeatable formats (all proven by the outliers above)

1. **The listicle** — "5 free AI tools blowing up in silence" / "Every builder needs these 8 tools".
   Workhorse format (~60% of output). 30–45s, one tool ≈ 6–8s: name → what it does → the money line.
2. **The news-jack** — "Google silently released 15 free AI tools that save you $1,000/month".
   Ride launches within 24–48h (~20%). The research step hunts these daily.
3. **The replacement** — "Stop paying for X — this free tool does it" / "This tool replaces 10 tools".
   Savings angle, high engagement (~15%).
4. **The versus** — "ChatGPT vs Claude for writing emails — one is 3× better." (~5%, grows with
   the library since both UIs get reused.)

**Hook rules (from what actually broke out):** a number + "free" + a money outcome in the first
line. "Silently / secretly / nobody talks about" outperforms. The first 1.5s must state the payoff
on screen AND in voice. Every claim about a tool gets fact-checked in research — one fabricated
feature kills channel trust.

## 3. The honest money math (read this before dreaming)

Shorts ad RPM is low. Grounded estimate (vidIQ calculator, Tech niche, US-weighted, 100% Shorts):
**3M views/month ≈ $180–480/month** in ads. Ads are the *bonus layer*, not the plan. The stack:

| Layer | Needs | When |
|---|---|---|
| **1. Affiliate links** (description + pinned comment) | nothing — day one | **Primary revenue.** AI tools pay 20–50% recurring (ElevenLabs, Notion, Jasper, Pictory, HubSpot… verify current terms per program). One video → recurring commissions. |
| 2. YPP fan funding | 500 subs + 3M Shorts views/90d + 3 uploads/90d | milestone 1 |
| 3. YPP ad revenue | 1,000 subs + 10M Shorts views/90d | milestone 2 |
| 4. Sponsorships | ~10K+ subs | AI startups pay $200–500+ per Short in this niche |
| 5. Long-form funnel | when Shorts prove which topics retain | 10–30× RPM — and the fork's ORIGINAL pipeline is already built for it |

Rule: **every Short covers at least one tool with an affiliate program when a genuinely good one
fits the topic** — never force a worse tool into a list because it pays. Trust compounds; commissions follow.

## 4. Cadence & operating rules

- **2/day sustained** (3/day only when the library makes marginal cost near zero). Batch-produce:
  research once daily → script 2–3 → render as a batch.
- **30–45 seconds** per Short. Under 30s hurts monetized watch time; over 60s hurts completion.
- Publish at fixed times (algorithm-agnostic, workflow-sane): ~11:00 & ~17:00 US-Eastern.
- Title ≤ 60 chars, front-load the number + outcome. 3 hashtags max (#ai #aitools + one specific).
- **One niche only.** No "fun" detours — topic consistency is how a small channel gets classified.
- Uploads land as **private drafts** (`tools/yt_upload.py`) — a human reviews before anything goes
  public. Non-negotiable: this is the demonetization firewall.

## 5. Originality policy (the YPP risk, managed)

YouTube demonetizes "repetitious/reused content" faceless channels. Our defense is structural:
- Visuals are **original generated UI demos + branded motion**, not stock loops or slideshows.
- Scripts state **specific numbers, use-cases, and a point of view**, never generic tool blurbs.
- The brand kit (`/brand-setup`) makes every frame recognizably ours.
- ElevenLabs voice is fine; **the value must be in the research + visuals**, not the narration alone.

## 6. The channel pivot (Legends Unveiled → the new identity)

Current state (vidIQ, 2026-08-07): 11 subs, 4,221 views, 9 videos, dormant, topic-classified
Lifestyle/Pets/Entertainment. The 1.5-year age helps YPP trust; the old identity is too small to
protect. Checklist:
1. Rename channel + handle to the new AI-tools brand; new avatar/banner (run `/brand-setup` first
   so the channel art and the video kit match).
2. Set the 9 old videos to **unlisted** (don't delete — keeps channel history) so the topic reset is clean.
3. Rewrite the channel description around the niche + add the affiliate disclosure line.
4. First week: publish 2/day from the backlog batch so the algorithm re-classifies quickly.

## 7. KPIs and the feedback loop

Weekly, `/shorts-report` pulls per-video stats (`tools/yt_stats.py`) and rewrites `learnings.md` —
which `/write-short` reads before every script. Grade against:
- **Swipe-through survival**: viewed vs swiped in first 2s (proxy: avg % viewed ≥ 70% at 30–45s).
- **Views per Short trend** week over week; any outlier ≥ 10× median → make 2 follow-ups in that
  sub-topic within 48h.
- **Milestones**: 500 subs + 3M/90d (funding tier) → 1K subs + 10M/90d (ads) → first sponsor at 10K.

If after **60 days / ~100 Shorts** the median Short is under 1K views, the format (not the niche)
gets re-examined against outliers first; the niche itself only after 2 such cycles. No panic pivots.
