# CHANNEL-KIT.md — everything to create the ToolMint channel

Copy-paste kit for creating the channel in YouTube's UI (channel creation needs your Google
account in a browser — that part is yours; everything else is prepared). The brand contract
behind all of it: `brand.md` / `remotion/src/brand.ts` / `NICHE-STRATEGY.md`.

## Identity

- **Channel name:** `ToolMint`
- **Handle (try in order):** `@toolmint` → `@toolmintai` → `@toolmint_ai`
  (whichever you get, record it here: ________ )
- **Tagline:** One money-making AI tool. Every day.
- **Voice:** ElevenLabs "Liam" — locked in `.env` + brand.md §1.

## Channel description (paste as-is)

> One money-making AI tool. Every day.
> ToolMint finds the AI tools that actually save you money or make you money — free tools,
> new launches, and honest head-to-heads. 30 seconds, no fluff, every single day at 11am & 5pm ET.
>
> Some links are affiliate links — they support the channel at no cost to you.
> Business: mshakilawan735@gmail.com

## Art (rendered from the brand — regenerate after any /brand-setup change)

- **Avatar:** `cd remotion && npx remotion still ChannelAvatar --frame=0 out/avatar.png`
  (800×800; YouTube circle-crops — the TM monogram is centered for it)
- **Banner:** `npx remotion still ChannelBanner --frame=0 out/banner.png`
  (2560×1440; all content inside YouTube's 1235×338 safe box)

## Channel settings checklist (Studio → Settings)

- [ ] Country: United States (matches the strategy's audience targeting), language English
- [ ] Keywords: `ai tools, ai, make money with ai, free ai tools, ai news`
- [ ] Feature eligibility: verify the channel by phone (unlocks custom thumbnails, >15min uploads)
- [ ] Upload defaults: category **Science & Technology**, visibility **Private**
- [ ] "Made for kids": No (channel-level default)
- [ ] Add the handle + channel URL back into this file and `NICHE-STRATEGY.md` §6

## Old channel (Legends Unveiled) — parked for niche #2

Per the two-channel decision: the new ToolMint channel runs NICHE-STRATEGY.md now; the old
channel is parked until the daily automation is fully hands-off, then gets its own niche +
strategy file (the engine gains per-channel config at that point — do not run two niches
through one brand contract).

## After creating the channel

1. `python tools/yt_upload.py auth` with THIS channel's Google account (tools/yt_upload_SETUP.md).
2. `python tools/yt_upload.py whoami` → must print ToolMint.
3. Tell Claude Code — the daily draft → approve → publish routine starts from there.
