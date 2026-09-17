# short-013 — "Firefox Just Killed The $19 AI Browser Subscription"

- **Format:** news-jack (learnings.md: news-jacks outperform listicles ~4x on this channel)
- **Angle:** named products (Firefox, Mistral, Merlin) + a hard number ($19), the pattern the data favours
- **Slot:** earliest open slot, 2026-09-18T15:00:00Z — the freshest news-jack of today's sweep
  (announced yesterday, 2026-09-16)
- **Research doc:** `videos/research/2026-09-17.md` (candidate #2, scored 22/25)

## Hook (3 variants, ≤12 words each)

1. **[WINNER]** "Firefox Just Killed The $19 AI Browser Subscription." (8 words)
2. "Your Browser Now Has Free AI. Stop Paying $19." (9 words)
3. "Firefox's New AI Copilot Is Free. Merlin Charges $19." (9 words)

Winner picked because it matches the house pattern learnings.md already validated (short-010's
"OpenAI Just Cut AI Prices By 80%" — a named actor + a decisive verb + a dollar figure), and it
front-loads the money outcome before the product name, per strategy §2's hook rule.

## Beats + sources (every claim checked live, 2026-09-17)

| # | Claim | Source |
|---|---|---|
| 1 | Mozilla partnered with Mistral to power Firefox's built-in AI assistant, "Smart Window," with the Mistral Small 4 model | blog.mozilla.org/en/firefox/mozilla-mistral-partnership/ — fetched today |
| 2 | Same partnership, Mistral's side: "conversations aren't saved on Mozilla's servers by default, and partners like Mistral agree to zero data retention" | mistral.ai/news/mistral-x-mozilla/ — fetched today |
| 3 | Announced 2026-09-16 (yesterday); rolling out now to Smart Window Beta users in the US and Canada, plus French-language support in France; UK and Germany "later this year" | blog.mozilla.org/en/firefox/mozilla-mistral-partnership/ — fetched today |
| 4 | Smart Window itself is a free, built-in Firefox feature — a new window type alongside Classic/Private, not a paid extension; no subscription or pricing has been disclosed for it | support.mozilla.org "Get started with Smart Window"; blog.mozilla.org firefox-smart-window — corroborated across 2 sources, no vendor page mentions a price |
| 5 | Merlin AI, a popular browser AI copilot (the kind of tool Smart Window replaces), charges $29/mo billed monthly or $19/mo billed annually for its Pro tier | eesel.ai "A clear-eyed guide to Merlin AI pricing" + SaaSWorthy "Merlin AI Pricing" — **secondary sources**; getmerlin.in/pricing returned HTTP 403 to the fetch tool twice, so this could not be confirmed on the vendor's own page today. Two independent trackers agree on the figure. |

**Caveat carried into the video:** claim #4 (Smart Window itself being free forever) is an
inference from "no price has been disclosed" during beta, not a vendor promise — narration says
"no subscription, no credit card" (true today) and does not claim it will always be free.

## Visual intent (remotion/src/lib/shorts.tsx)

- **Cover (0s, loop target):** `HookTitle` over `ShortBg` — the hook text on-screen at frame 0,
  a browser-window graphic behind it with a red strikethrough over "$19/mo" next to a green "$0".
- **Beat 1–2 (setup):** `ToolCard` for Firefox Smart Window — logo/name, "built-in, not an
  extension," "powered by Mistral Small 4." `CountBadge` (1 of 3) style numbering optional.
- **Beat 3 (money):** a two-column `ToolCard` price comparison — Merlin Pro "$19–29/mo" vs Firefox
  Smart Window "$0" — this is the proof slot the hook promises.
- **Beat 4 (availability):** small on-screen caption strip: "US · Canada · France now — UK,
  Germany later in 2026" (per skill's honesty-about-limits instinct — don't oversell reach).
- **Close:** cut back to the cover frame/composition so the last frame == first frame for the
  Shorts replay loop; `Watermark` in the corner throughout.

## CTA / loop

Ends on "The nineteen dollar subscription is dead" — a restatement of the hook's claim, timed to
land back on the cover's price-comparison graphic so the replay reads as a clean loop, not a
dead stop. No "like and subscribe" outro line (per strategy §2, testing CTA-free loops).
