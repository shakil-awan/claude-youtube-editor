# CHANNEL-KIT.md — everything to create the ToolMint channel

Copy-paste kit for creating the channel in YouTube's UI (channel creation needs your Google
account in a browser — that part is yours; everything else is prepared). The brand contract
behind all of it: `brand.md` / `remotion/src/brand.ts` / `NICHE-STRATEGY.md`.

## Identity

- **Channel name:** `ToolMint`
- **Channel (CREATED 2026-08-07):** https://www.youtube.com/channel/UCMHlMONvE1BFnSF_LskYyyA
  — channel id `UCMHlMONvE1BFnSF_LskYyyA` (yt_stats + /shorts-report use this)
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

## Giving the pipeline upload access (OAuth — the only mechanism YouTube allows)

**Step 1 — mint the tokens (your machine, browser needed, once):**
1. Google Cloud setup per `tools/yt_upload_SETUP.md` (project → enable YouTube Data API v3 →
   consent screen with your account as test user → Desktop-app OAuth client →
   save as `.youtube/client_secret.json`).
2. `python tools/yt_upload.py auth` → in Google's account chooser **pick the ToolMint channel,
   not your main account/old channel** (brand accounts appear as separate rows — the wrong row
   authorizes the wrong channel).
3. `python tools/yt_upload.py whoami` → must print **ToolMint**. If it prints anything else,
   delete `.youtube/token.json` and re-auth picking the right row.

**Step 2 — choose where uploads run:**
- **Local (simplest, the AUTOMATION.md default):** the daily batch + uploads run on your
  machine/VPS where `.youtube/` lives. Nothing more to do.
- **Cloud sessions too (Claude Code on the web):** tokens can't be minted in the cloud (no
  browser) but can be *carried* as environment secrets:
  `python tools/restore_youtube_auth.py --export` on the authed machine → add the printed
  `YT_CLIENT_SECRET_B64` / `YT_TOKEN_B64` values to the Claude Code **environment settings**
  (secrets — NEVER paste them into chat, never commit) along with `ELEVENLABS_API_KEY` →
  cloud sessions then run `python tools/restore_youtube_auth.py` and can upload.

Treat both values like channel passwords: anyone holding them can upload to ToolMint.
